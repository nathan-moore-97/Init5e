var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var ip = 'localhost';
var port = 6807;

var init = require('./Initiative');
var bot = require('./bot.js');

characters = [
    {
        job: "new_char", 
        charName: "Firenewt Warrior", 
        dexMod: 1, 
        hasAdv: false, 
        pc: false, 
        desc: "Large, two handed scimitar"
    },
    {
        job: "new_char", 
        charName: "Firenewt Warrior", 
        dexMod: 1, 
        hasAdv: false, 
        pc: false, 
        desc: "Shield and scimitar with a hand crossbow"
    },
    {
        job: "new_char", 
        charName: "Salamander", 
        dexMod: 2, 
        hasAdv: false, 
        pc: false, 
        desc: ""
    }, 
    {
        job: "new_char", 
        charName: "Artimis", 
        dexMod: 4, 
        hasAdv: true, 
        pc: true, 
        desc: "Human Ranger. Aritmis likes to shoot things."
    }
]


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

app.get('/bot', function(req, res){
    res.send("Adding bots characters...");
    characters.forEach(element => {
        bot.addCharacter(element);
    });
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

bot.login(process.env.DISCORD_TOKEN);
bot.attach(init);
app.listen(port, ip);

console.log("Started on port: " + port);
