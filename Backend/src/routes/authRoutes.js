const express = require('express');
const routes = express.Router();
const CalendarService = require('../services/calendarService');
const Personal = require('../model/Personal');
const calendarService = new CalendarService();

routes.get('/google-auth/start', async (req, res) => {
    try {
        const { personalId } = req.query;
        if (!personalId) {
            return res.status(400).json({ error: 'personalId é obrigatório.' });
        }
        const personal = await Personal.findById(personalId);
        if (!personal) {
            return res.status(404).json({ error: 'Personal trainer não encontrado.' });
        }
        const { authUrl } = await calendarService.getAccessToken(personal);
        res.json({ authUrl });
    } catch (error) {
        console.error('Erro ao iniciar auth Google:', error);
        res.status(500).json({ error: error.message });
    }
});


routes.get('/google-auth/callback', async (req, res) => {
    try {
        const { code, state } = req.query; 
        const personalId = req.query.personalId || JSON.parse(decodeURIComponent(state)).personalId; 
        
        if (!code || !personalId) {
            return res.status(400).json({ error: 'Código de autorização ou personalId ausente.' });
        }

        const personal = await calendarService.saveToken(personalId, code);
        
        res.status(200).send('Autorização do Google Calendar concluída com sucesso para ' + personal.name);
    } catch (error) {
        console.error('Erro no callback do Google:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = routes;