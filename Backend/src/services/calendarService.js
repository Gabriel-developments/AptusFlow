const { google } = require('googleapis');
require('dotenv').config();

class CalendarService {
    constructor() {
        this.auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }

    async authorizePersonal(personal) {
        if (personal.googleToken) {
            this.auth.setCredentials(JSON.parse(personal.googleToken));
            return this.auth;
        }
        return this.getAccessToken(personal);
    }

    async getAccessToken(personal) {
        const authUrl = this.auth.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar'],
        });
        
        return { authUrl, personalId: personal._id };
    }

    async saveToken(personalId, code) {
        const { tokens } = await this.auth.getToken(code);
        this.auth.setCredentials(tokens);
        
        const Personal = require('../model/Personal');
        const personal = await Personal.findByIdAndUpdate(
            personalId,
            { googleToken: JSON.stringify(tokens) },
            { new: true }
        );
        
        return personal;
    }

    async createCalendarForPersonal(personal) {
        const auth = await this.authorizePersonal(personal);
        const calendar = google.calendar({ version: 'v3', auth });
        
        const calendarId = `${personal.email.replace(/[@.]/g, '_')}_${personal._id}`;
        
        try {
            const res = await calendar.calendars.insert({
                requestBody: {
                    summary: `Agenda ${personal.name} (CREF: ${personal.CREF})`,
                    timeZone: 'America/Sao_Paulo'
                }
            });
            
            const Personal = require('../model/Personal');
            await Personal.findByIdAndUpdate(
                personal._id,
                { calendarId: res.data.id },
                { new: true }
            );
            
            return res.data;
        } catch (error) {
            console.error('Erro ao criar calendário:', error);
            throw error;
        }
    }

    async setDefaultAvailability(personal) {
    }

    async createEvent(personal, eventDetails) {
    try {
        const auth = await this.authorizePersonal(personal);
        const calendar = google.calendar({ version: 'v3', auth });

        if (!personal.calendarId) {
            throw new Error("Calendar ID não encontrado para este usuário.");
        }

        const defaultEvent = {
            summary: "Consulta/Agendamento",
            description: "Agendamento via sistema",
            start: {
                dateTime: eventDetails.startTime, 
                timeZone: 'America/Sao_Paulo',
            },
            end: {
                dateTime: eventDetails.endTime,   
                timeZone: 'America/Sao_Paulo',
            },
            attendees: eventDetails.attendees?.map(email => ({ email })) || [],
            reminders: {
                useDefault: true, 
            },
        };

        
        const response = await calendar.events.insert({
            calendarId: personal.calendarId,
            requestBody: defaultEvent,
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao criar evento:", error.message);
        throw error;
    }
}
}

module.exports = CalendarService;