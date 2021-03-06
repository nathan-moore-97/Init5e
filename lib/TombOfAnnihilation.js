var env = require('dotenv').config();
var dice = require('./dice');
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

// Random temperature generator
function temperature() {
    var roll = dice.d(20);
    // Its a normal day
    if (roll < 15) {
        return 90 + dice.d(9);
    }
    // extreme heat
    if (roll > 17) {
        return 100 + dice.d(10);
    }
    // random heavy cold front
    if (roll > 14 && roll < 18) {
        return 95 - (dice.d(4) * 10);
    }
}

// Roll for the wind conditions
function wind() {
    var roll = dice.d(20);
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
    var roll = dice.d(20);
    if (roll > 17) {
        if(dice.d(4) === 1) {
            return "a Tropical Storm is coming in!";
        }
        return "heavy rain";
    }

    if(roll > 12) {
        return "light rain";
    }

    return "no rain";
}

// Rolls a new weather state and sets it to the current weather field
function rollWeather() {

    var w = wind();
    var p = precipitation();

    currWeather = {
        temp: temperature(),
        wind: w,
        precipitation: p,
        ambience: chooseAmbience(w, p)
    }

    return currWeather;
}

function chooseAmbience(w, p) {
    if(p.includes('Tropical Storm')) {
        return process.env.HURRICANE_AMBIENCE;
    }

     if(p === 'heavy rain') {
        return process.env.HEAVY_RAIN_AMBIENCE;
    }

    if(w === 'strong winds') {
        return process.env.WINDY_FOREST_AMBIENCE;
    }

    if(p === 'light rain') {
        return process.env.LIGHT_RAIN_AMBIENCE;
    }

    return process.env.RAINFOREST_AMBIENCE;

}