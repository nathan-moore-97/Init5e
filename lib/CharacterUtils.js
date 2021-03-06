var exports = module.exports = {};
var dice = require('./dice');
/*
    Libarary of util functions for dealing with characters
*/

// incrementing id for each character 
var currId = 0;

// Build character from the input JSON object
exports.Character = function(obj) {
    return {
        //                  Identification information
        id                  : currId++,
        player              : obj.player_name,
        name                : obj.char_name,
        //                  Character information
        dex                 : parseInt(obj.dex),
        dexMod              : Math.floor((parseInt(obj.dex) - 10) / 2), 
        race                : obj.race,
        class               : obj.class,
        level               : obj.level, // This can be null, NPCs will not have levels
        speed               : obj.speed,
        ac                  : obj.ac,
        passivePerception   : obj.passive_perception,
        saveDc              : obj.spell_save,
        adv                 : obj.init_adv === 0,
        notes               : obj.notes,
        alignment           : obj.alignment,
        hit                 : 5, // For now, this will remain the constant growth of 5
        //                  Meta information for the app
        pc                  : !(obj.player_name.trim() === 'DM'),
        topOfOrder          : false,
        init                : null
    }
}

// dump characters state to the console
exports.printCharacter = function(char) {
    console.log(`${char.id}: ${char.name} (dexMod  ${char.dexMod}) INIT: ${char.init}`);
}

exports.roll = function(char) {
    char.init = dice.d(20) + char.dexMod;

    // If character has advantage on initiative
    if (char.adv) {
        char.init = Math.max(char.init, dice.d(20) + char.dexMod);
    }
}