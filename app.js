var express = require('express');
var env = require('dotenv').config();
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

var ip = process.env.IP;
var web_port = process.env.WEB_PORT;
var init_local = null;

const connection = null;

// ------------------------------ Server side network ----------------------------

// Function expects a JSON object that it will send over the wire
// as UTF data
function send(payload) {
    if (connection.connected) {
        connection.sendUTF(JSON.stringify(payload));
        setTimeout(sendNumber, 1000);
    }
}

// Attempt to connect to the dnd5e service
client.on('connectFailed', function(error) {
    console.error('Connect Error: ' + error.toString());
    console.log('Building local initiative....');
    init_local = require('./lib/Initiative');
});

client.on('connect', function(conn) {
    console.log('WebSocket Client Connected');

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function() {
        console.log(`${process.env.PROTOCOL} Connection Closed`);
    });


    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // console.log("Received: '" + message.utf8Data + "'");
            console.log(JSON.decode(message.utf8Data));
        }
    });

});

client.connect(`ws://${process.env.IP}:${process.env.SERV_PORT}/`, `${process.env.PROTOCOL}`);

// ----------------------------------- HTTP server -------------------------------



// serve local public files
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.get('/initiative', function(req, res){
    res.send(init.getOrder());
    res.end();
});

app.post('/initiative', function(req, res) {
    switch (req.body.job) {
        case "new_char":
            res.send("Adding " + req.body.charName + " to initiative!");
            init.addCharacter(req.body);
            res.end();
            break;
        case "next":
            res.send(init.next());
            res.end();
            break;
        case "peek":
            res.send(init.peek());
            res.end();
            break;
        case "pop":
            var rip = init.remove(req.body.which);
            res.send(rip);
            res.end();
            break;
        case "clear":
            init.clear();
            res.send("Initiative cleared");
            res.end();
            break;
    }
});

app.listen(web_port, ip);
console.log("Started on port: " + web_port);