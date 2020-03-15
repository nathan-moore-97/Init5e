
var exports = module.exports = {};

// s-sided die
exports.d = function(s) {
    return Math.floor(Math.random() * (s - 1 + 1)) + 1;
}

// roll s-sided die n-times
exports.nd = function(n, s) {
    var acc = 0;
    for(var i = 0; i < n; i++) {
        acc += exports.d(s);
    }
    return acc;
}

