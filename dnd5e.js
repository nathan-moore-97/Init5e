
/*
    This is a service designed to be a platform that Friendly-DM, 
    init5e and any other applications I write for my table will use. 

    This is also intended as a sort of 'singleton' that will track 
    keep its own state across all of the endpoints that attach to it, 
    i.e. Friendly-DM and init5e. 

    @author Nathan Moore
*/

var dice = require('./lib/Dice');
var tomb = require('./lib/TombOfAnnihilation');
var madness = require('./lib/Madness');
var init = require('./lib/Initiative');
var wild = require('./lib/WildMagic')

var exports = module.exports = {};

exports.Dice = dice;
exports.ToA = tomb;
exports.Madness = madness;
exports.Initiative = init;
exports.WildMagic = wild;
