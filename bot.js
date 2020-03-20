// Generic modules
const fs = require('fs');
const env = require('dotenv').config();
const axios = require('axios');
// Discord modules
const discord = require('discord.js');
const ytdl = require('ytdl-core');
// Local modules
var fifthEd = require('./dnd5e');
var init = null;

const client = new discord.Client();
var exports = module.exports = {};


//--------------------------------------------------- Bot setup ---------------------------------------------------

const images = []
var temp = [];
var prefix = '!';
const queue = new Map(); // Music functionality
var init5eUrl = `http://${process.env.IP}:${process.env.WEB_PORT}`

client.login(process.env.DISCORD_TOKEN);

client.once('ready', function() {
    console.log(`Discord client: ${client.user.username}`);
    console.log(`Loaded ${images.length} tips`)
});

// read in the image files
fs.readdir("./media/tips", function (err, files) {
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
                // Async function will deal with the reply
                postToInit5e(msg, {job: 'ping', data: `${msg.author.username} pinged you!`});
                break;
            case 'tip':
                // grab a random index from the list of files
                var index = between(0, temp.length);
                // send the image
                msg.channel.send("~ Tip from the Friendly DM ~", {files: ["./media/tips/" + temp[index]]});
                // removes that element
                temp.splice(temp, 1);
                // if we have sent all of the tips, refill
                if(temp.length === 0) {
                    temp = images.slice();
                }
                console.log(temp.length + " remaining...");
                break;
            case 'peek':
                var peek = init.peek();
                if (peek === undefined) {
                    msg.channel.send('Oops! Looks like initiative is empty...');
                } else {
                    var embed = new discord.RichEmbed();
                    embed.setTitle(`~ Initiative Order ~`);
                    embed.addField(`**Up now:**`, `${peek[0].name}`);
                    if (peek[1].pc) {
                        embed.addField(`**Up next:**`, `${peek[1].name}`);
                    }
                    
                    if(peek[2].pc) {
                        embed.addField(`**On deck:**`, `${peek[2].name}`);
                    }

                    msg.channel.send(embed);
                }
                break;
            case 'prefix':
                msg.reply(`My prefix is: ${prefix}. You will be able to use that command to change it soon.`);
                break;
            case 'weather':
                var weather = fifthEd.ToA.weather(msg.content.includes('roll'));
                msg.reply(`Temperature is ${weather.temp} degrees Farenheit with ${weather.wind}, and ${weather.precipitation}.`);
                if(msg.content.includes('ambience')) {
                    ambience(weather.ambience, msg);
                }
                break;
            case 'leave':
                msg.member.voiceChannel.leave();
                break;
            case 'madness':
                if(msg.content.split(' ')[1] === 'long') {
                    msg.author.send(`Longterm madness: ${fifthEd.Madness.longTerm()}`);
                } else if (msg.content.split(' ')[1] === 'short') {
                    msg.author.send(`Short term madness: ${fifthEd.Madness.shortTerm()}`);
                } else if (msg.content.split(' ')[1] === 'indefinite') {
                    msg.author.send(`Indefinite madness: ${fifthEd.Madness.indefinite()}`);
                } else {
                    msg.reply(`Specify short or long term with '${prefix}madness [short, long, or indefinite]'`);
                }
                break;
            case 'roll':
                var roll = msg.content.toLowerCase().split(' ')[1].split('d');
                var s = parseInt(roll[1]);
                var n = isNaN(parseInt(roll[0])) ? 1 : parseInt(roll[0]);
                if (isNaN(s)) {
                    msg.reply(`Please enter a valid number for your roll`);
                    break;
                }
                msg.reply(`${fifthEd.Dice.nd(n, s)}`);
                break
            case 'wildmagic':
                msg.author.send(`Wild Magic Surge: ${fifthEd.WildMagic.surge()}`);
                break;
            case 'die':
                process.exit();
            case 'chaos':
                var peek = init.peek();
                if (peek === undefined) {
                    msg.channel.send(`Oops! Looks like initiative is empty...`);
                } else {
                    msg.channel.send(`The chaos of battle rages around you...`);
                }
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

// Sends a packet of data to the init5e frontend
const postToInit5e = async (msg, payload) => {
    // post request to init5e app using axios
    ;(async () => {
        const response = await axios.post(`${init5eUrl}/friendly-dm`, payload)
        
    })()
}


//--------------------------------------------------- Utility ----------------------------------------------------

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function between(min, max) {  
    return Math.floor(Math.random() * (max - min) + min);
}

// ---------------------------------------------------- Music ----------------------------------------------------

async function ambience(query, msg) {
    const voiceChannel = msg.member.voiceChannel;
    const songInfo = await ytdl.getInfo(query);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };
    console.info(`AMBIENCE\t${song.title}`);
    var connection = await voiceChannel.join();
    play(connection, song);
}

function play(connection, song) {

	if (!song) {
		connection.voiceChannel.leave();
		return;
	}

	const dispatcher = connection.playStream(ytdl(song.url))
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(.5);
}