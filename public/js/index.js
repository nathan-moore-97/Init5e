
// ------------------------------------------------TEMP all of the characters in this combat------------------------------------------------
const characters = []

// bad bad jank.
function addFromFile(file) {
    $.post('/characters', {which: file}, function(res) {
        res.characters.forEach(element => {
            element.job = "new_char";
            $.post( "/initiative", element, function(res) { }); // TODO Error Checking?
        });
    }).then(function() {
        prepareInitiativeList();
    });
}

function clear() {
    $.post("/initiative", {job: "clear"}, function(res) {}).then(function() {
        location.reload();
    });    
}

// HORRIBLE JANK
function dragonFight() {
    clear(); 
    addFromFile("players.json");
    addFromFile("tzindelor.json");
}
// HORRIBLE JANK
function salamanderFight() {
    clear(); 
    addFromFile("players.json");
    addFromFile("salamander_fight.json");
}

// ----------------------------------------------------- Frontend Util functions ----------------------------------------------------- 

// This function populates the "Currently" and "Up Next" fields on the jumbotron
// It also takes the response from the next request and places the information into 
// DM Dashboard
function upNext() {
    $.post("/initiative", {job: "next"}, function(res) {
        $("#currentCharacter").text(res.name);
        $("#detailsCharName").html("<strong>Name: </strong>" + res.name);
        $("#detailsCharDesc").html("<strong>Notes: </strong>" + res.desc);
        if(!res.pc) {
            $("#isNPC").css("display", "block");
            $("#lookupBtn").css("display", "block");
        } else {
            $("#isNPC").css("display", "none");
            $("#lookupBtn").css("display", "none");
        }
    });

    $.post("/initiative", {job: "peek"}, function(res) {
        $("#nextCharacter").text(res[1].name);
    });
}


function lookupCurrent() {
    gotoMonster($("#currentCharacter").text());
}

// Attempts to navigate the page to a monster sheet, that appears to be fairly complete. 
// This is one hell of a bodge but its the best thing I got without doing a shit ton of homework. 
function gotoMonster(meanie) {
    var urlBase = "https://jsigvard.com/dnd/monster.php?m=";
    window.open(urlBase + meanie, "_blank");
}

function prepareInitiativeList() {
    // populate the initiative list
    $.get("/initiative", function(res) {
        $("#orderListGroup").empty();

        res.forEach(function(elem) {
            console.log(elem);
            $("#orderListGroup").append(
                `<li class=\"list-group-item\">
                    <strong id="btnRemoveCharById" onclick="remove(${elem.id})">X</strong> 
                    (${elem.init}) 
                    <strong>${elem.name}</strong>
                </li>`
            );        
        });
    });
}

function remove(character) {
    console.log("Removing: " + character);
    $.post('/initiative', {job: "pop", which: character}, function(res) {
        console.log(res);
    });
    prepareInitiativeList();
    $.post("/initiative", {job: "peek"}, function(res) {
        $("#nextCharacter").text(res[1].name);
    });
}

const prepCharacterAndSend = eventObj => {
    eventObj.preventDefault();
    $('#addCharacterForm').trigger('reset');
}

// ------------------------------------------------------------- SETUP -----------------------------------------------------------------

console.log("Welcome to the Init5e Tracker!");
prepareInitiativeList();