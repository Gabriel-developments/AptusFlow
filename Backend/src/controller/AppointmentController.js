const Personal = require('../model/Personal');
const GymMember = require('../model/GymMember');
const CalendarService = require('../services/calendarService');
const { google } = require('googleapis');
const calendarService = new CalendarService();

class AppointmentController {
    async createAppointment(personalId, memberId, appointmentData) {
        try {
            const personal = await Personal.findById(personalId);
            if (!personal) {
                throw new Error('Personal trainer não encontrado');
            }

            const member = await GymMember.findById(memberId);
            if (!member) {
                throw new Error('Cliente não encontrado');
            }

            if (!personal.calendarId) {
                try {
                    await calendarService.createCalendarForPersonal(personal);
                } catch (authError) {
                    throw new Error(`Erro ao configurar calendário para o personal trainer: ${authError.message}. Certifique-se de que a autorização do Google Calendar foi concluída.`);
                }
            }

            const startTime = new Date(`${appointmentData.date}T${appointmentData.time}:00`);
            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + (personal.availability.appointmentDuration || 60));

            const isAvailable = await this.checkAvailability(personal, startTime, endTime);
            if (!isAvailable) {
                throw new Error('Horário indisponível');
            }

            const eventDetails = {
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                attendees: [member.email],
                description: appointmentData.notes || `Consulta com ${member.name}`
            };

            const event = await calendarService.createEvent(personal, eventDetails);

            return {
                success: true,
                event: {
                    id: event.id,
                    personal: personal.name,
                    client: member.name,
                    start: event.start.dateTime,
                    end: event.end.dateTime,
                    status: event.status,
                    htmlLink: event.htmlLink
                }
            };
        } catch (error) {
            console.error('Erro no AppointmentController:', error);
            throw error;
        }
    }

    async checkAvailability(personal, startTime, endTime) {
        try {
            const dayOfWeek = startTime.getDay();
            if (!personal.availability.workDays.includes(dayOfWeek)) {
                return false;
            }

            const startHour = startTime.getHours();
            const endHour = endTime.getHours();
            if (startHour < personal.availability.startHour || 
                endHour > personal.availability.endHour) {
                return false;
            }

            const auth = await calendarService.authorizePersonal(personal);
            
            if (!(auth instanceof google.auth.OAuth2)) {
                throw new Error('Autorização do Google Calendar pendente para o personal trainer.');
            }

            const calendar = google.calendar({ version: 'v3', auth });

            const events = await calendar.events.list({
                calendarId: personal.calendarId,
                timeMin: startTime.toISOString(),
                timeMax: endTime.toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            return events.data.items.length === 0;
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            // Propagate the specific error if it's related to authorization
            if (error.message.includes('autorização') || error.message.includes('Authorization')) {
                throw error;
            }
            return false;
        }
    }

    async listAvailableSlots(personalId, date) {
        try {
            const personal = await Personal.findById(personalId);
            if (!personal) {
                throw new Error('Personal trainer não encontrado');
            }

            const queryDate = new Date(date);
            const dayOfWeek = queryDate.getDay();
            if (!personal.availability.workDays.includes(dayOfWeek)) {
                return [];
            }

            const startOfDay = new Date(date);
            startOfDay.setHours(personal.availability.startHour, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(personal.availability.endHour, 0, 0, 0);

            const auth = await calendarService.authorizePersonal(personal);
            
            if (!(auth instanceof google.auth.OAuth2)) {
                throw new Error('Autorização do Google Calendar pendente para o personal trainer.');
            }

            const calendar = google.calendar({ version: 'v3', auth });

            const events = await calendar.events.list({
                calendarId: personal.calendarId,
                timeMin: startOfDay.toISOString(),
                timeMax: endOfDay.toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            const slotDuration = personal.availability.appointmentDuration || 60;
            const allSlots = this.generateTimeSlots(
                startOfDay, 
                endOfDay, 
                slotDuration
            );

            const bookedSlots = events.data.items.map(event => ({
                start: new Date(event.start.dateTime),
                end: new Date(event.end.dateTime)
            }));

            return allSlots.filter(slot => {
                return !bookedSlots.some(booked => 
                    (slot.start >= booked.start && slot.start < booked.end) ||
                    (slot.end > booked.start && slot.end <= booked.end) ||
                    (slot.start <= booked.start && slot.end >= booked.end)
                );
            });
        } catch (error) {
            console.error('Erro ao listar horários disponíveis:', error);
            throw error;
        }
    }

    generateTimeSlots(startOfDay, endOfDay, duration) {
        const slots = [];
        const current = new Date(startOfDay);
        
        while (current < endOfDay) {
            const slotEnd = new Date(current);
            slotEnd.setMinutes(slotEnd.getMinutes() + duration);
            
            if (slotEnd <= endOfDay) {
                slots.push({
                    start: new Date(current),
                    end: new Date(slotEnd)
                });
            }
            
            current.setMinutes(current.getMinutes() + duration);
        }
        
        return slots;
    }
}

module.exports = AppointmentController;