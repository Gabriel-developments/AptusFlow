const express = require('express');
const connectInDB = require('./src/config/db');
const loginRoutes = require('./src/routes/loginRoutes');
const registerRoutes = require('./src/routes/registerRoutes');
const subscriptionsRoutes = require('./src/routes/paymentsRoutes/subscriptionsRoutes');
const app = express( );

connectInDB();

app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/subscription', subscriptionsRoutes);

module.exports = app;

app.listen(3000, ( )=>{
    console.log('server is running');
})