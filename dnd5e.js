
/*
    This is a service designed to be a platform that Friendly-DM, 
    init5e and any other applications I write for my table will use. 

    This is also intended as a sort of 'singleton' that will track 
    keep its own state across all of the endpoints that attach to it, 
    i.e. Friendly-DM and init5e. 

    @author Nathan Moore
*/

// Generic modules
var env = require('dotenv').config();
// Network modules
var WebSocketServer = require('websocket').server;
var http = require('http');
// Local modules
var initiative = require('./lib/Initiative');
var tomb = require('./lib/TombOfAnnihilation');
var madness = require('./lib/Madness');
var charUtils = require('./lib/CharacterUtils');

// --------------------------------------------------------------------------------------



// ------------------------------- Set up socket server ---------------------------------

var connId = 0;

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(process.env.SERV_PORT, function() {
    console.log(`${new Date()} Server is listening on port ${process.env.SERV_PORT}`);
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

// -------------------------------- Network Management --------------------------------

wsServer.on('request', function(request) {
    var connection = request.accept(process.env.PROTOCOL, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    // console.log(connection);
    var thisConnection = connId++;
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log(thisConnection + ': Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

// ---------------------------- ChaosEngine API Version 0.0 ----------------------------