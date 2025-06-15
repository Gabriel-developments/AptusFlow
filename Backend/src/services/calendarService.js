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
        
      
        const Personal = require('../models/Personal');
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
            
            const Personal = require('../models/Personal');
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
}

module.exports = new CalendarService();