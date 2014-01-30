// app.js
var express = require('express'),
    mongoose = require('mongoose'),
    config = require('config'),
    io = require("socket.io");

var app = express();

mongoose.connect('mongodb://localhost/buzzbuddy', config.Connection);
var db = mongoose.connection;

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
})
// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect()
})

// Start the app by listening on <port>
var port = process.env.PORT || 8000
app.listen(port)
console.log('Express app started on port '+port)