
var cm = require('./CharacterUtils');
var dice = require('./dice.js');
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

exports.get = function(id) {
    return chars.find(function(elem) {
        return elem.id == id;
    });
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

exports.updateScoreById = function(update) {

    var ind = chars.indexOf(chars.find(function(elem){
        return elem.id == update.which;
    }));

    chars[ind].init = parseInt(update.score);
    return chars[ind];
}

exports.getByName = function(search) {
    var ind = chars.indexOf(chars.find(function(elem){
        //console.log(`${elem.name}\t${update.which} -> ${elem.name === update.which}`)
        return elem.name === search.which;
    }));
    return chars[ind];
}

exports.updateScoreByName = function(update) {
    var ind = chars.indexOf(chars.find(function(elem){
        console.log(`${elem.name}\t${update.which} -> ${elem.name === update.which}`)
        return elem.name === update.which;
    }));

    chars[ind].init = parseInt(update.score);
    return chars[ind];
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

// Initiative will start to climb each round with each character getting a random localized boost 
// to their initiative score. This means that the inits close to each other to have a good chance 
// of shuffling but those farther apart wont shuffle around every turn. 
exports.anticipationShuffle = function(pcPin) {
    chars.forEach(element => {
        element.init += dice.d(element.hit); // default 5
    });
    exports.order();
    return chars;
}

// All monsters re-roll initiative
exports.fullShuffle = function(pcPin) {
    chars.forEach(element => {
        if(!element.pc || !pcPin) {
            cm.roll(element);
        }
    });
    exports.order();
    return chars;
}

// like anticipation shuffle but the gain is calculcated from other attributes
exports.expertiseShuffle = function(pcPin) {
    throw {name : "NotImplementedError", message : "too lazy to implement"}; 
}

// All monsters swap their initiative scores around, 
// no new scores are rolled. Optionally the pcs are 
// included in this shuffle. 
exports.swapShuffle = function(pcPin) {
    var before = chars.filter(function(c) {
        return !c.pc || !pcPin;
    });

    var scores = before.map(x => x.init);
    scores.shuffle();
    var w = 0;
    chars.forEach(c => {
        if(!c.pc || !pcPin) {
            c.init = scores[w++];
        }
    });
    exports.order();
    return chars;
}

Array.prototype.shuffle = function() {
    var m = this.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = this[m];
        this[m] = this[i];
        this[i] = t;
    }

    return this;
}