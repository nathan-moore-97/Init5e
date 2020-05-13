
// ------------------------------------------------TEMP all of the characters in this combat------------------------------------------------
const characters = []


function loadEncounter(en) {
    // Query from the database to lookup the encounter
    $.get('/data', {encounterName: en}, function(eRes) {
        // Discard result for now, send it to the .then() function.
    }).then(function(eRes) {
        // Check if the encounter is good
        if (eRes.hasOwnProperty('err')) {
            logError(eRes.err, en);
            return;
        }
        // Update the banner to match the fight details
        // The naming style of the rows coming out of the db will be in the convention of the database
        $(`#initiativeTitle`).text(eRes[0].encounter_name);
        $(`#initiativeDesc`).text(eRes[0].encounter_notes);
        // Try to get fight details
        $.get('/data', {fightName: en}, function(fRes) {
            // Check if the fight actually exists
            if (fRes.hasOwnProperty('err')) {
                logError(`Error retrieving fight after good encounter, ${fRes.err}`, en);
                return;
            }
            // Then, for each character in the fight, post to initiative
            fRes.forEach(element => {
                element.job = "new_char";
                $.post( "/initiative", element, function(cp) { }); // TODO Error Checking?
            });
        }).then(function() {
            // Finally, prepare the local initiative list
            prepareInitiativeList();
        });
    });
}


function clearInit() {
    $.post("/initiative", {job: "clear"}, function(res) {}).then(function() {
        location.reload();
    });    
}

// ----------------------------------------------------- Frontend Util functions ----------------------------------------------------- 

function logError(msg, specifics) {
    console.error(`INIT_5e | \t${msg}: '${specifics}'`);
}

// This function populates the "Currently" and "Up Next" fields on the jumbotron
// It also takes the response from the next request and places the information into 
// DM Dashboard
function upNext() {
    $.post(`/initiative`, {job: `next`}, function(res) {
        $(`#currentCharacter`).text(res.name);
        $(`#detailsCharName`).html(`<strong>Name: </strong>${res.name}`);
        $(`#detailsPlayerName`).html(`<strong>(${res.player})</strong>`);
        $(`#detailsCharDesc`).html(`<strong>Notes: </strong>${res.notes}`);
        
        if(!res.pc) {
            $(`#lookupBtn`).css(`display`, `block`);
            $(`#detailsAlignment`).html(`<strong>Alignment: </strong>${res.class}`);
            $(`#detailsClass`).html(`<strong>Class: </strong>none`);
        } else {
            $(`#lookupBtn`).css(`display`, `none`);
            $(`#detailsClass`).html(`<strong>Class: </strong>${res.class}`);
            $(`#detailsAlignment`).html(`<strong>Alignment: </strong>${res.alignment}`);
        }

        $(`#detailsRace`).html(`<strong>Race: </strong>${res.race}`);
        $(`#detailsLevel`).html(`<strong>Level: </strong>${res.level}`);
        $(`#detailsSpeed`).html(`<strong>Speed: </strong>${res.speed}`);

        $(`#detailsArmorClass`).html(`<strong>AC: </strong>${res.ac}`);
        $(`#detailsPassivePerception`).html(`<strong>PP: </strong>${res.passivePerception}`);
        $(`#detailsSaveDC`).html(`<strong>SDC: </strong>${res.saveDc}`);
        

        if (res.topOfOrder && $(`#rollAtTop`).prop(`checked`)) {
            $.get(`/roll`, function(res) {});
            prepareInitiativeList();
        }
    });

    $.post(`/initiative`, {job: `peek`}, function(res) {
        $(`#nextCharacter`).text(res[1].name);
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
    // Scoop the character form and send to the init
    $('#addCharacterForm').trigger('reset');
}

// ---------------------------------------------------------- SOCKET IO -----------------------------------------------------------------
$(function () {
    var socket = io();
    socket.on('ping', function(payload){
        if (payload != undefined) {
            $('#stream').text(payload);
        }
    });
});



// ------------------------------------------------------------- SETUP -----------------------------------------------------------------

console.log("Welcome to the ChaosEngine Initiative Tracker!");
prepareInitiativeList();