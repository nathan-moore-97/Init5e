var exports = module.exports = {};

/*
    Libarary of util functions for dealing with characters
*/

// Produce a random number between 1 and 20, inclusive
function d20() {
    return Math.floor(Math.random() * (20 - 1 + 1)) + 1;
}

// Build character from the input JSON object
exports.Character = function(obj) {
    return {
        name : obj.charName,
        dex  : parseInt(obj.dexMod),
        adv  : obj.hasAdv,
        desc : obj.desc,
        init : null
    }
}

exports.printCharacter = function(char) {
    console.log(char.name + " (dex  " + char.dex + ") INIT: " + char.init)
}

exports.roll = function(char) {
    char.init = d20() + char.dex;

    // If character has advantage on initiative
    if (char.adv) {
        char.init = Math.max(char.init, d20() + char.dex);
    }
}