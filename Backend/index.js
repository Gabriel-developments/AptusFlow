const express = require('express');
const connectInDB = require('./src/config/db');
const loginRoutes = require('./src/routes/loginRoutes');
const registerRoutes = require('./src/routes/registerRoutes');
const subscriptionsRoutes = require('./src/routes/paymentsRoutes/subscriptionsRoutes');
const ReturnPersonals = require('./src/controller/ReturnPersonals');
const appointmentsRoutes = require('./src/routes/appointmentRoutes');
const cors = require('cors');
const app = express( );

connectInDB();
app.use(cors());
app.use(express.json());

app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/subscription', subscriptionsRoutes);
app.get('/api/returnPersonals', ReturnPersonals);
app.use('/api/appointments', appointmentsRoutes);

module.exports = app;

app.listen(3000, ( )=>{
    console.log('server is running');
})