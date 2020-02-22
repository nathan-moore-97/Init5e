
var cm = require('./character');
var exports = module.exports = {};

const chars = [];

exports.active = false;
exports.initPtr = 0;

exports.peek = function() {
    return chars[exports.initPtr];
}

exports.next = function() {
    var ret = chars[exports.initPtr];
    exports.initPtr = ((exports.initPtr + 1) % chars.length);
    return ret;
}

exports.getOrder = function() {
    return chars;
}

exports.clear = function() {
    chars.length = 0;
    exports.active = false;
    exports.initPtr = 0;
}

exports.addCharacter = function(name, dex, adv) {
    var newChar = cm.Character(name, dex, adv);
    cm.roll(newChar);
    chars.push(newChar);
    exports.order();

}

exports.show = function() {
    console.log(chars);
    chars.forEach(element => {
        cm.printCharacter(element);
    });
}

exports.order = function() {
    chars.sort(function(a, b) {

        if (a.init === b.init) {
            return (a.dex < b.dex) ? 1 : -1;
        }

        return (a.init < b.init) ? 1 : -1;
    });

}