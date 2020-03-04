
var exports = module.exports = {};

// Current weather of this instance
var currWeather = null;

/*
    Request the current weather. If roll=true is passed, the system will generate a new weather state
    However if roll=false is passed, it will return the most recent weather state
    Finally, if the weather is request for the first time from this instance, the weather will be rolled
    and returned. 
*/
exports.weather = function(roll) {
    if(roll){
        return rollWeather();
    } else {
        return (currWeather != null) ? currWeather : rollWeather();
    }
}

// -------------------------------------- Module utility functions ----------------------------------------

// n-sided die
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
            return "a Tropical Storm is coming in!";
        }
        return "heavy rains";
    }

    if(roll > 12) {
        return "light rain";
    }

    return "no rain";
}

// Rolls a new weather state and sets it to the current weather field
function rollWeather() {
    currWeather = {
        temp: temperature(),
        wind: wind(),
        precipitation: precipitation()
    }

    return currWeather;
}

