// Generic modules
const fs = require('fs');
// Discord modules
const discord = require('discord.js');
const client = new discord.Client();
// Local modules
var bound = false;
var init = require('./Initiative');

var exports = module.exports = {};

client.once('ready', function() {
    console.log("Discord client: " + client.user.username);
});

client.login('NjA3NTczNDcwMDAzMzMxMDky.XUblfQ.XH7UCj98gDu_x5-hNH7JEuOb9g4');

exports.attach = function(i) {
    console.log('Attaching initiative process to discord');
    init = i;
    return init;
}

exports.addCharacter = function(char) {
    init.addCharacter(char);
}