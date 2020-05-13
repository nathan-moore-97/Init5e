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
        id          : currId++,
        player      : obj.player_name,
        name        : obj.char_name,
        dex         : parseInt(obj.dex_mod),
        adv         : obj.init_adv === 0,
        desc        : obj.desc,
        pc          : !(obj.player_name.trim() === 'DM'),
        topOfOrder  : false,
        init        : null
    }
}

// dump characters state to the console
exports.printCharacter = function(char) {
    console.log(`${char.id}: ${char.name} (dex  ${char.dex}) INIT: ${char.init}`);
}

exports.roll = function(char) {
    char.init = dice.d(20) + char.dex;

    // If character has advantage on initiative
    if (char.adv) {
        char.init = Math.max(char.init, dice.d(20) + char.dex);
    }
}