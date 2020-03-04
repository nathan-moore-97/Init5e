var express = require('express');
var env = require('dotenv').config();
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var ip = process.env.IP;
var port = process.env.PORT;

var init = require('./lib/Initiative');
var bot = require('./bot');



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

bot.attach(init);
app.listen(port, ip);

console.log("Started on port: " + port);