// The 'dotenv' mdule basically reads data from .env file and load it to process.env.
require('dotenv').config(); 

// This imports ExpressJS Module
var express = require('express');

// Creating an ExpressJS App
var app = express();

// We now pass the app instance to a custom module 'app' for bootstrapping\\
require('./app')(app);

app.listen(app.get('port'), () => {
    console.log(`Server is listening to the port ${app.get('port')}`);
})