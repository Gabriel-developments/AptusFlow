const express = require('express');
const connectInDB = require('./src/config/db');
const app = express( );

connectInDB();

app.listen(3000, ( )=>{
    console.log('server is running');
})