// The 'dotenv' mdule basically reads data from .env file and load it to process.env.
require('dotenv').config(); 

// This imports ExpressJS Module
var express = require('express');

// Creating an ExpressJS App
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.setMaxListeners(0);
io.setMaxListeners(0);


app.use(function(req,res,next){
    req.io = io;
    next();
    req.port = app.get('port');
});

//Socket

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('aboutusBackend', function(aboutusData){
        io.emit('aboutusClient', aboutusData);
    })
    socket.on('contactusBackend', function(contactusData){
        io.emit('contactusClient', contactusData);
    })
    socket.on('testimonialBackend', function(testimonialData){
        io.emit('testimonialClient', testimonialData);
    })
});

// We now pass the app instance to a custom module 'app' for bootstrapping\\
require('./app')(app);

server.listen(app.get('port'), () => {
    console.log(`Server is listening to the port ${app.get('port')}`);
})