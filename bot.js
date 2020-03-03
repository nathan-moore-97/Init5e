// Generic modules
const fs = require('fs');
const env = require('dotenv').config();
// Discord modules
const discord = require('discord.js');
// Local modules
var init = require('./Initiative');


const client = new discord.Client();
var exports = module.exports = {};


//--------------------------------------------------- Bot setup ---------------------------------------------------

const images = []
var temp = [];
var prefix = '!';

client.login(process.env.DISCORD_TOKEN);

client.once('ready', function() {
    console.log(`Discord client: ${client.user.username}`);
    console.log(`Loaded ${images.length} tips`)
});

// read in the image files
fs.readdir("./media", function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        images.push(file);
    });
    // creates a copy, that we will remove from whenever the bot posts a tip image
    temp = images.slice();
});



// recieve messages
client.on('message', function(msg) {
    // check to see if the message is targeting the bot
    if (msg.content.startsWith(prefix)) {
        // parse the command
        var command = msg.content.split(' ')[0].slice(1);
        switch (command) {
            case 'ping':
                msg.reply("Pong!");
                break;
            case 'tip':
                // grab a random index from the list of files
                var index = between(0, temp.length);
                // send the image
                msg.channel.send("~ Tip from the Friendly DM ~", {files: ["./media/" + temp[index]]});
                // removes that element
                temp.splice(temp, 1);
                // if we have sent all of the tips, refill
                if(temp.length === 0) {
                    temp = images.slice();
                }
                console.log(temp.length + " remaining...");
                break;
            case 'peek':
                msg.channel.send(`${init.peek().name} is next in the order!`);
                break;
            case 'prefix':
                msg.reply(`My prefix is: ${prefix}. You will be able to use that command to change it soon.`);
                break;
            case 'weather':
                var weather = init.getWeather(msg.content.split(' ')[1] === 'roll');
                msg.reply(`Temperature is ${weather.temp} degrees Farenheit with ${weather.wind}, and ${weather.precipitation}.`);
                break;
            case 'madness':
                msg.author.send("Ho ho ho, you're as mad as a hatter!!");
                break;
            default:
                msg.reply(`Unrecognized command: ${command}. I would help, but Nathan hasn't written that function yet.`);
                break;
        }
    }
});

//---------------------------------------------- Init5e Integration ----------------------------------------------

exports.attach = function(i) {
    console.log('Attaching initiative process to discord');
    init = i;
    return init;
}

exports.addCharacter = function(char) {
    init.addCharacter(char);
}

//--------------------------------------------------- Utility ----------------------------------------------------

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function between(min, max) {  
    return Math.floor(Math.random() * (max - min) + min);
}