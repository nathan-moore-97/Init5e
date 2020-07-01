var exports = module.exports = {};

exports.mySqlRealEscapeString  = function(str) {
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

exports.sqlBuilder = function(req) {
    console.log(req);
    switch (req.job) {
        case 'create':
            return handleCreateRequest(req);
        case 'update':
            return handUpdateRequest(req);
        case 'delete':
            return handleDeleteRequest(req);
        case 'get':
            return handleGetRequest(req);
        // WHICH fields in a search query will be cleaned, then will have the spaces replaced with wild cardss

        case 'danger':
            return req.ins;
        default:
            return {err: `Unrecognized sqlBuilder job: '${req.job}'`};
    }
}

function handleCreateRequest(req) {
    switch (req.what) {
        case 'character':
            return handleCreateCharacterRequest(req);
        case 'encounter':
            return handleCreateEncounterRequest(req);
        case 'fight':
            return handleCreateFightRequest(req);
        default:
            return {err: `Unrecognized CREATE request: unknown type ${req.what}`}
    }
}

function handleUpdateRequest(req) {
    switch (req.what) {
        case 'character':
            return handleUpdateCharacterRequest(req);
        case 'encounter':
            return handleUpdateEncounterRequest(req);
        case 'fight':
            return handleUpdateFightRequest(req);
        default:
            return {err: `Unrecognized UPDATE request: unknown type ${req.what}`}
    }
}

function handleDeleteRequest(req) {
    switch (req.what) {
        case 'character':
            return handleDeleteCharacterRequest(req);
        case 'encounter':
            return handleDeleteEncounterRequest(req);
        case 'fight':
            return handleDeleteFightRequest(req);
        default:
            return {err: `Unrecognized DELETE request: unknown type ${req.what}`}
    }
}

function handleGetRequest(req) {
    switch (req.what) {
        case 'character':
            return handleGetCharacterRequest(req);
        case 'encounter':
            return handleGetEncounterRequest(req);
        case 'fight':
            return handleGetFightRequest(req);
        default:
            return {err: `Unrecognized GET request: unknown type ${req.what}`}
    }
}

// This boy needs a lot of input sanitization
function handleCreateCharacterRequest(req) {

    var player = exports.mySqlRealEscapeString(req.player);
    var name = exports.mySqlRealEscapeString(req.name);
    var _class = exports.mySqlRealEscapeString(req.class) != undefined ? exports.mySqlRealEscapeString(req.class) : 'NULL';
    var race = exports.mySqlRealEscapeString(req.race);
    var level = (!isNaN(parseInt(req.level))) ? parseInt(req.level) : 'NULL';
    var ac = parseInt(req.ac);
    var pp = parseInt(req.passivePerception);
    var speed = (!isNaN(parseInt(req.speed))) ? parseInt(req.speed) : 'NULL';
    var sdc = (!isNaN(parseInt(req.saveDc))) ? parseInt(req.saveDc) : 'NULL';
    console.log(req.notes, notes);
    var notes = exports.mySqlRealEscapeString(req.notes) != undefined ? exports.mySqlRealEscapeString(req.notes).trim() : 'NULL';
    var dex = parseInt(req.dex);
    var alignment = exports.mySqlRealEscapeString((req.alignment));
    var isNpc = !(req.player.trim() === 'DM');
    var hasAdv = req.adv === 'on' || req.adv === true;

    // Make sure all non-nullable properties have values
    if (player != undefined &&  name != undefined && race != undefined && !isNaN(ac) && !isNaN(pp) && !isNaN(dex)) {
        return {ins: `insert into lu_character (player_name, char_name, class, race, level, ac, passive_perception, speed, spell_save, notes, dex, pc, init_adv, alignment)
                    values('${player}', '${name}', '${_class}', '${race}',  ${level}, ${ac} , ${pp}, ${speed}, ${sdc}, '${notes}', ${dex}, ${isNpc}, ${hasAdv}, '${alignment}');`}
    }

    return {err: `CREATE Character with a malformed or absent value field`}
}

function handleCreateEncounterRequest(req) {
    var en = exports.mySqlRealEscapeString(req.name);
    var notes = exports.mySqlRealEscapeString(req.description);

    if(en != undefined) {
        if (notes === undefined) {
            notes = `NULL`;
        }
        return {ins: `insert into lu_encounter (encounter_name, encounter_notes) values ('${en}', '${notes}')`}
    }
    return {err: `CREATE Encounter with empty name`}
}

// Create fight expects an encounter id and a list of character ids.
function handleCreateFightRequest(req) {
    var eid = parseInt(req.encounterId);

    // Need to do this because lists of length one are converted to strings over the wire 
    // for some stupid god damn reason
    if (typeof req['characterIdList[]'] === 'string') {
        req['characterIdList[]'] = [req['characterIdList[]']];
    }
    
    if (!isNaN(eid)) {
        var insBuild = `insert into lu_fight (encounter_id, combatant_id) values `;
        for(var i = 0; i < req['characterIdList[]'].length; i++) {
            var cid = parseInt(req['characterIdList[]'][i]);
            if(isNaN(cid)) {
                return {err: `CREATE Fight with an invalid character id`}
            }
            insBuild += `(${eid}, ${cid})`
            if (i != req['characterIdList[]'].length - 1) {
                insBuild += `,`
            }
        }
        return {ins: insBuild}
    } 
    return {err: `CREATE Fight with invalid encounter id`}
}


function handleUpdateCharacterRequest(req) {
    return {err: `UPDATE Character not implemented yet`}
}

function handleUpdateEncounterRequest(req) {
    return {err: `UPDATE Encounter not implemented yet`}
}

function handleUpdateFightRequest(req) {
    return {err: `UPDATE Fight not implemented yet`}
}


function handleDeleteCharacterRequest(req) {
    var whichId = parseInt(exports.mySqlRealEscapeString(req.id));
    if(!isNaN(whichId)) {
        return {ins: `delete from lu_character where character_id = ${whichId}`}
    }
    return {err: `DELETE Character with invalid id`}
}

function handleDeleteEncounterRequest(req) {
    var whichId = parseInt(exports.mySqlRealEscapeString(req.id));
    if(!isNaN(whichId)) {
        return `delete from lu_encounter where encounter_id = ${whichId}`;
    }
    return {err: `DELETE Encounter with invalid id`}
}

function handleDeleteFightRequest(req) {
    var whichId = parseInt(exports.mySqlRealEscapeString(req.id));
    return {err: `DELETE Fight not implemented yet`}
}


function handleGetCharacterRequest(req) {
    // Get by id
    var whichId = exports.mySqlRealEscapeString(req.id);
    if (whichId != undefined) {
        return {ins: `select * from lu_character where character_id = ${whichId}`}
    }
    // Was not looking for id, get by name
    var whichName = exports.mySqlRealEscapeString(req.name);
    // returns a list of matches on a name search
    if(whichName != undefined) {
        return {ins: `select * from lu_character where char_name like '%${whichName}%'`}
    }
    return {err: `GET Character with undefined id field`}
}

function handleGetEncounterRequest(req) {
    // Check for ID first
    var whichId = exports.mySqlRealEscapeString(req.id);
    if(whichId != undefined) {
        if (whichId === '-1') {
            return {ins: `select * from lu_encounter`}
        }
        return {ins: `select * from lu_encounter where encounter_id = ${whichId}`}
    }
    // Then if no id get by name
    var whichName = exports.mySqlRealEscapeString(req.name);
    if(whichName != undefined) {
        return {ins: `select * from lu_encounter where encounter_name ='${whichName}'`}
    }

    return {err: `GET Encounter with undefined id or name field`}
}

// This one is a little different. Since lu_fight is a join table, 
// Getting any one particular row would not be very useful. 
// GetFight expects an enounter name and returns a list of characters
// that make up the initiative
function handleGetFightRequest(req) {
    var whichId = exports.mySqlRealEscapeString(req.id);
    if(whichId != undefined) {
        return {ins: `select player_name, char_name, character_id, class, combatant_id, dex, race, ac, speed, spell_save, passive_perception, init_adv, level, pc, notes
                from lu_encounter 
                join lu_fight 
                on lu_encounter.encounter_id = lu_fight.encounter_id
                join lu_character
                on lu_character.character_id = lu_fight.combatant_id
                where lu_encounter.id = ${whichId}`};
    }

    var whichName = exports.mySqlRealEscapeString(req.name);
    if (whichName != undefined) {
        return {ins: `select player_name, char_name, character_id, class, combatant_id, dex, race, ac, speed, spell_save, passive_perception, init_adv, level, pc, notes
                from lu_encounter 
                join lu_fight 
                on lu_encounter.encounter_id = lu_fight.encounter_id
                join lu_character
                on lu_character.character_id = lu_fight.combatant_id
                where encounter_name = '${whichName}'`};
    }

    
    return {err: `GET Fight with undefined id or name field`}
}
