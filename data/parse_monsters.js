
var fs = require('fs');

function mySqlRealEscapeString(str) {
    if(str === undefined){
        return undefined;
    }

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

function handleCreateCharacterRequest(req) {

    var player = mySqlRealEscapeString(req.player);
    var name = mySqlRealEscapeString(req.name);
    var _class = name;
    var race = (`${req.size} ${req.type} ${req.subtype}`).trim();
    var level = 'NULL';
    var ac = req.armor_class;
    var pp = req.perception != null ? req.perception : req.wisdom;
    var speed = req.speed.walk;
    var sdc = (!isNaN(parseInt(req.saveDc))) ? parseInt(req.saveDc) : 'NULL';
    var dex = parseInt(req.dexterity);
    var alignment = mySqlRealEscapeString(req.alignment);
    var isNpc = !(req.player.trim() === 'DM');
    var hasAdv = req.adv === 'on' || req.adv === true;
    var notes = req.document__title;

    // Make sure all non-nullable properties have values
    if (player != undefined &&  name != undefined && race != undefined && !isNaN(ac) && !isNaN(pp) && !isNaN(dex)) {
        return {ins: `insert into lu_character (player_name, char_name, class, race, level, ac, passive_perception, speed, spell_save, notes, dex_mod, pc, init_adv, alignment) values('${player}', '${name}', '${_class}', '${race}',  ${level}, ${ac} , ${pp}, ${speed}, ${sdc}, '${notes}', ${dex}, ${isNpc}, ${hasAdv}, '${alignment}');`}
    }

    return {err: `CREATE Character with a malformed or absent value field`}
}

var mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.IP,
    user: "root",
    password: "",
    database: "chaos5e"
});

var script = ""

fs.readFile('monster_list.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var json = JSON.parse(data);
    json.baddies.forEach(element => {
        // console.log(element);
        element.player = 'DM';
        var sql = handleCreateCharacterRequest(element);
        console.log(sql.ins);
        script += `${sql.ins}\n`;
    });
});

console.log(script);