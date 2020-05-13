var express = require('express');
var env = require('dotenv').config();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var app = express();
// socket.io, for the bot pushing updates to the frontend
var http = require('http').createServer(app);
var io = require('socket.io')(http)
// local modules
var init = require('./dnd5e').Initiative;
var bot = require('./bot');
var ip = process.env.IP;
var port = process.env.WEB_PORT;

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

// ------------------------------------------------------------------------------

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
    socket.on('disconnect', function() {});
    socket.on('ping', function(){
        console.log(`ping reply`);
    });
});

// ------------------------------------------------------------------------------
// Database handling
var mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.IP,
    user: "root",
    password: "",
    database: "chaos5e"
});

// My database handling
con.connect(function(err) {
    if (err) throw err;
    console.log(`Connected to MySQL[${con.config.database}]`);

    // Retrieve database rows
    app.get('/data', function(req, res) {
        var queryString = generateQuery(req.query);
        if (queryString === undefined) {
            res.send({err: `SQL Builder returned empty string. Perhaps GET query parameters are malformed.`});
            res.end();
        } else {
            con.query(queryString, function(err, data) {
                if (err) throw err;
                if (data.length == 0) {
                    res.send({err: `No data matches your input`});
                    res.end();
                } else {
                    res.send(data);
                    res.end();
                }
            });
        }
    });

    // Add things to the database
    app.post('/data', function(req, res){
        res.send('Cannot post to /data yet!');
        res.end();
    });



});

// Takes in a req.query object and generates sql to send in response
function generateQuery(body) {
    // Getting a specific character by name
    if (body.hasOwnProperty('charName')) {
        var cn = mySqlRealEscapeString(body.charName);
        return `select * from lu_character where char_name = '${cn}'`
    }

    // return specific encounter
    if (body.hasOwnProperty('encounterName')) {
        var en = mySqlRealEscapeString(body.encounterName);
        return `select * from lu_encounter where encounter_name = '${en}'`;
    }

    // return specific initiative list
    if (body.hasOwnProperty('fightName')) {
        var en = mySqlRealEscapeString(body.fightName);
        return `select 
                    player_name,
                    char_name, 
                    character_id, 
                    class,
                    combatant_id,
                    dex_mod,
                    race,
                    ac,
                    speed,
                    spell_save,
                    passive_perception,
                    init_adv,
                    level,
                    pc,
                    notes
                from lu_encounter 
                join lu_fight 
                on lu_encounter.encounter_id = lu_fight.encounter_id
                join lu_character
                on lu_character.character_id = lu_fight.combatant_id
                where encounter_name = '${en}'`;
    }
}


function mySqlRealEscapeString (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            default:
                return char;
        }
    });
}

// -----------------------------------------------------------------------------

bot.attach(init);
http.listen(port, ip);


console.log("Started on port: " + port);