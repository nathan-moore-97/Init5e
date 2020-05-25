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
var dbu = require('./lib/Chaos5eDbUtils')
var ip = process.env.IP;
var port = process.env.WEB_PORT;


var exports = module.exports = {};
exports.init = init;

var viewState = "tracking";


// serve local public files
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.get('/view', function(req, res){
    res.send(viewState);
    res.end();
});

app.post('/view', function(req, res) {
    viewState = req.body.viewState;
    res.send(viewState);
    res.end();
});

app.get('/builder', function(req, res) {
    res.sendFile(`${__dirname}/public/encounterBuilder.html`);
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
        case "newChar":
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
        case "updateInit":
            var update = init.updateScoreById(req.body);
            init.order();
            res.send(update);
            res.end();
            break;
        default:
            req.body.err = `Request received, but unknown job field`;
            res.send(req.body);
            res.end();
            break;
    }
});

// ------------------------------------------------------------------------------

app.post("/friendly-dm", function(req, res){
    switch(req.body.job) {
        case 'ping':
            io.emit('ping', req.body.data);
            res.send("init5e frontend successfully pinged");
            res.end();
            break;
        case 'init':
            var udpate = init.updateScoreByName(req.body);
            init.order();
            io.emit('init', {which: req.body.which, score: req.body.score});
            res.send(`Updated ${req.which} to ${res.score}`);
            res.end();
            break;
        default:
            console.log(req.body);
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
        var q = req.query;
        q.job = 'get';
        var sql = dbu.sqlBuilder(q);
        // console.log(q);
        // var queryString = generateLookupQuery(req.query);
        if (sql.err !=  undefined) {
            res.send(sql);
            res.end();
        } else {
            // the GET instructions will always have one line
            con.query(sql.ins, function(err, data) {
                if (err) {
                    res.send({err: `${err.code}: ${err.sqlMessage}`});
                    res.end();
                } else if (data.length == 0) {
                    res.send({err: `No data matches your input`});
                    res.end();
                } else {
                    res.send(data);
                    res.end();
                }
            });
        }
    });

    // CREATE, RETRIEVE, UPDATE, DELETE
    app.post('/data', function(req, res){
        var sql = dbu.sqlBuilder(req.body);
        if(sql.err != undefined) {
            res.send(sql);
            res.end();
        } else {
            con.query(sql.ins, function(err, data) {
                if (err) {
                    res.send({err: `${err.code}: ${err.sqlMessage}`});
                    res.end();
                    return;
                } else {
                    res.send(`Action completed successfully`);
                    res.end();
                }
            });
        }
    });
});

// -----------------------------------------------------------------------------

bot.attach(init);
http.listen(port, ip);


console.log("Started on port: " + port);