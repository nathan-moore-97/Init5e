
var exports = module.exports = {};


// Twenty sided die
function d(n) {
    return Math.floor(Math.random() * (n - 1 + 1)) + 1;
}

// Random temperature generator
function temperature() {
    var roll = d(20);
    // Its a normal day
    if (roll < 15) {
        return 90 + d(9);
    }
    // extreme heat
    if (roll > 17) {
        return 100 + d(10);
    }
    // random heavy cold front
    if (roll > 14 && roll < 18) {
        return 95 - (d(4) * 10);
    }

}

// Roll for the wind conditions
function wind() {
    var roll = d(20);
    if (roll > 17) {
        return "strong winds";
    }

    if (roll > 11) {
        return "light winds";
    }

    return "no wind";
}

// How rainy is it?
function precipitation() {
    var roll = d(20);
    if (roll > 17) {
        if(d(4) === 1) {
            return "a Tropical Storm is coming in";
        }
        return "heavy rains";
    }

    if(roll > 12) {
        return "light rain";
    }

    return "no rain";
}

exports.rollWeather = function() {
    return {
        temp: temperature(),
        wind: wind(),
        precipitation: precipitation()
    }
}