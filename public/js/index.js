
// TEMP all of the characters in this combat

characters = [
    {   
        job: "new_char", 
        charName: "Matthias", 
        dexMod: 2, 
        hasAdv: false, 
        pc: true, 
        desc: "Human Warlock, servant of Dendar the Night Serpent. His Eldritch Blast has the effect of constricting and crushing the life out of his prey. Matthias's left eye was changed during the transformation after abandoning the contract with Mal, and now appears to be the eye of a great snake."
    }, 
    {
        job: "new_char", 
        charName: "Rosá", 
        dexMod: 2, 
        hasAdv: false, 
        pc: true, 
        desc: "Yuan-Ti Wild Magic Sorcerer. She joined the party following the Death of Omaha and has more or less attached herself like a parasite to the party, waiting for a good time to make her intentions known.<br><br>Her brother, Orchidius, grew up with her in Omu under the baleful gaze of the sorcerer Ras Nsi, which has lead her to being mistrustful of most other creatures in Chult, especially the party of adventurers with whom she now travels. <br><br>Her brother, Orchidius, grew up with her in Omu under the baleful gaze of the sorcerer Ras Nsi, which has lead her to being mistrustful of most other creatures in Chult, especially the party of adventurers with whom she now travels."
    },
    {
        job: "new_char", 
        charName: "Norban", 
        dexMod: -2, 
        hasAdv: false, 
        pc: true, 
        desc: "Barbarian. Norban like to hit things a lot."
    },
    {
        job: "new_char", 
        charName: "Eli", 
        dexMod: 3, 
        hasAdv: true, 
        pc: true, 
        desc: "Human School of Swords Bard. Lost his hand in an accident and found a magical prostethic "
    },
    {
        job: "new_char", 
        charName: "Firenewt Warrior", 
        dexMod: 1, 
        hasAdv: false, 
        pc: false, 
        desc: "Shield and a scimitar"
    },
    {
        job: "new_char", 
        charName: "Firenewt Warrior", 
        dexMod: 1, 
        hasAdv: false, 
        pc: false, 
        desc: "Will ambush from the cielling and savage the enemy"
    },
    {
        job: "new_char", 
        charName: "Firenewt Warrior", 
        dexMod: 1, 
        hasAdv: false, 
        pc: false, 
        desc: "Large, two handed scimitar"
    },
    {
        job: "new_char", 
        charName: "Firenewt Warrior", 
        dexMod: 1, 
        hasAdv: false, 
        pc: false, 
        desc: "Shield and scimitar with a hand crossbow"
    },
    {
        job: "new_char", 
        charName: "Salamander", 
        dexMod: 2, 
        hasAdv: false, 
        pc: false, 
        desc: ""
    }, 
    {
        job: "new_char", 
        charName: "Artimis", 
        dexMod: 4, 
        hasAdv: true, 
        pc: true, 
        desc: "Human Ranger. Aritmis likes to shoot things."
    }
]

var artus = {
    job: "new_char", 
    charName: "Artus Climber", 
    dexMod: 3,
    hasAdv: true,
    pc: false, 
    desc: "Artus Climber, Lawful Good. Friend to Dragonbait and Bane of Ras Nsi. Weilds a longsword and the magical Ring of Winter."
}

// This function populates the "Currently" and "Up Next" fields on the jumbotron
// It also takes the response from the next request and places the information into 
// DM Dashboard
function upNext() {
    $.post("/initiative", {job: "next"}, function(res) {
        $("#currentCharacter").text(res.name);
        $("#detailsCharName").html("<strong>Name: </strong>" + res.name);
        $("#detailsCharDexMod").html("<strong>Dex: </strong>" + res.dex);
        $("#detailsCharDesc").html("<strong>Notes: </strong>" + res.desc);

        if(!res.pc) {
            $("#isNPC").style("display: none");
        } else {
            $("#isNPC").style("display: block");
        }

    });

    $.post("/initiative", {job: "peek"}, function(res) {
        $("#nextCharacter").text(res.name);
    });
}

console.log("Welcome to the Init5e Tracker!");

$.post("/initiative", {job: "clear"}, function(res) {}); // TODO Error Checking?

// TEMP
characters.forEach(element => {
    element.job = "new_char";
    $.post( "/initiative", element, function(res) {}); // TODO Error Checking?
});

// populate the initiative list
$.get("/initiative", function(res) {
    $("#orderListGroup").empty();
    res.forEach(function(elem) {
        $("#orderListGroup").append("<li class=\"list-group-item\">(" + elem.init + ") <strong>" + elem.name + "</strong></li>");
    });
});