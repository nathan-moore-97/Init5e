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
        name        : obj.charName,
        dex         : parseInt(obj.dexMod),
        adv         : obj.hasAdv === 'true',
        desc        : obj.desc,
        pc          : obj.pc === 'true',
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