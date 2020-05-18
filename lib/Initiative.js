
var cm = require('./CharacterUtils');

// TODO: Very temp. remove as soon as possible

var exports = module.exports = {};

const chars = []; // list of characters in this initiative

exports.active = false; // deprecated. shows whether or not a roll has been called. 
exports.initPtr = 0; // Ptr used to point to the current character in the order

// peeks the next character in the order, without advancing whos on top
exports.peek = function() {
    return [
        chars[(chars.length + ((exports.initPtr - 1) % chars.length)) % chars.length],
        chars[(chars.length + ((exports.initPtr) % chars.length)) % chars.length],
        chars[(chars.length + ((exports.initPtr + 1) % chars.length)) % chars.length]
    ];
}

// Returns the character on the top of the order and moves the init order up one. 
exports.next = function() {
    var ret = chars[exports.initPtr];
    exports.initPtr = ((exports.initPtr + 1) % chars.length);
    return ret;
}

// returns the intiative list
exports.getOrder = function() {
    return chars;
}

// Clears the initiative order. 
exports.clear = function() {
    chars.length = 0;
    exports.active = false;
    exports.initPtr = 0;
}

// Add a new character to the initiative order. The character rolls a 
// d20 and is immiediatly sorted into the order. 
exports.addCharacter = function(dbObject) {
    var newChar = cm.Character(dbObject);
    cm.roll(newChar);
    chars.push(newChar);
    exports.order();
}

// Dumps the initiative order to the server console. For debugging purposes only. 
exports.show = function() {
    chars.forEach(element => {
        cm.printCharacter(element);
    });
}

// removes a character from initiative based on its location in the order. 
exports.remove = function(which) {
    var ind = chars.indexOf(chars.find(function(elem){
        return elem.id == which;
    }));
    var ded = chars.splice(ind, 1)[0];
    console.log(`${ded.name} has been removed from the order.`);
    exports.order();
    return `${ded.name} has been removed from the order.`;
}

exports.roll = function() {
    chars.forEach(c => {
        cm.roll(c);
    });
    exports.order();
}

exports.updateScore = function(update) {

    var ind = chars.indexOf(chars.find(function(elem){
        return elem.id == update.which;
    }));

    chars[ind].init = parseInt(update.val);
    return chars[ind]
}

// Sorts the initiative as a priority queue with the utility function being the initiative score. 
exports.order = function() {
    chars.sort(function(a, b) {
        a.topOfOrder = false;
        b.topOfOrder = false;
        if (a.init === b.init) {
            return (a.dex < b.dex) ? 1 : -1;
        }

        return (a.init < b.init) ? 1 : -1;
    });
    chars[0].topOfOrder = true;
}