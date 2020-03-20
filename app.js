var express = require('express');
var env = require('dotenv').config();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var app = express();
// socket.io, for the bot pushing updates to the frontend
var http = require('http').createServer(app);
var io = require('socket.io')(http)

var ip = process.env.IP;
var port = process.env.WEB_PORT;

var init = require('./dnd5e').Initiative;
var bot = require('./bot');

var exports = module.exports = {};

exports.init = init;

// serve local public files
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.get('/initiative', function(req, res) {
    res.send(init.getOrder());
    res.end();
});

app.get('/roll', function(req, res) {
    init.roll();
    res.send(init.getOrder());
    res.end();
});

app.post('/characters', function(req, res) {
    fs.readFile(`encounters/${req.body.which}`, 'utf8', function (err, data) {
        if (err) throw err;
        res.send(JSON.parse(data));
    });
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
            var rip = init.remove(parseInt(req.body.which));
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

app.post("/friendly-dm", function(req, res){
    switch(req.body.job) {
        case 'ping':
            console.log(req.body);
            io.emit('ping', req.body.data);
            res.send("init5e frontend successfully pinged");
            res.end();
            break;
        default:
            console.log(req.body)
            break;
    }
});

io.on('connection', function(socket) {
    console.log('DM Connected');

    socket.on('disconnect', function() {
        console.log('DM disconnected');
    });

    socket.on('ping', function(){
        console.log(`ping reply`);
    });

});

bot.attach(init);
http.listen(port, ip);

console.log("Started on port: " + port);