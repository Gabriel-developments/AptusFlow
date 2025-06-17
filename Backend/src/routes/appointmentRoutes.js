const express = require('express');
const routes = express.Router();
const AppointmentController = require('../controllers/appointmentController');
const appointmentController = new AppointmentController();

routes.post('/', async (req, res) => {
    try {
        const { personalId, memberId, date, time, notes } = req.body;
        const result = await appointmentController.createAppointment(
            personalId, 
            memberId, 
            { date, time, notes }
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

routes.get('/personals/:id/availability', async (req, res) => {
    try {
        const { date } = req.query;
        const slots = await appointmentController.listAvailableSlots(
            req.params.id, 
            date
        );
        res.json(slots);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = routes;