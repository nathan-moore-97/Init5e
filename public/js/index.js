
// --------------------------------------------------- VIEW CONTROLS -----------------------------------------------
const characters = []

function loadView(state) {
    if(state != undefined) {
        // post the new state to the server
        $.post('/view', {viewState: state}, function(res){
            console.log(`Load ${state} view...`); // TODO error checking
        });
    }
    // get the view state from the server
    $.get('/view', function(res){
        console.log(res);
        switch (res) {
            case `tracking`:
                $(`#trackerView`).show();
                $(`#builderView`).hide();
                prepareInitiativeList();
                break;
            case `building`:
                $(`#trackerView`).hide();
                $(`#builderView`).show();
                prepareEncounterList();
                break;
            default:
                logError('Invalid view state', res);
                break;
        }
    });
}

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
                element.job = "newChar";
                $.post( "/initiative", element, function(cp) { }); // TODO Error Checking?
            });
        }).then(function() {
            // Finally, prepare the local initiative list
            prepareInitiativeList();
        });
    });
}

function prepareEncounterList() {
    console.log("READY THE ENCOUNTERS, JIM");
}


function clearInit() {
    $.post("/initiative", {job: "clear"}, function(res) {}).then(function() {
        location.reload();
    });    
}

function prepareInitiativeList() {
    // populate the initiative list
    $.get("/initiative", function(res) {
        $("#orderListGroup").empty();
        res.forEach(function(elem) {
            $("#orderListGroup").append(
                `<li class=\"list-group-item\">
                    <strong id="btnRemoveCharById" onclick="remove(${elem.id})">X</strong> 
                    <span id="btnUpdateInitiative" onclick="openUpdateInitModal(${elem.id}, '${elem.name}')">(${elem.init})</span> 
                    <strong>${elem.name}</strong>
                </li>`
            );        
        });
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

const postNewCharacterToDatabase = eventObj => {
    eventObj.preventDefault();
    var payload = {job: 'newChar'};

    // Scoop the character form and send to the init
    payload.player = $('#playerNameField').val();
    payload.name = $('#characterNameField').val();
    payload.race = $('#raceField').val();
    payload.alignment = $('#alignmentField').val();
    payload.dex = $('#dexModSelector').val();
    payload.ac = $('#armorClassSelector').val();
    payload.passivePerception = $('#passivePerceptionSelector').val();
    payload.saveDc = $('#saveDcSelector').val();
    payload.class = $('#classField').val();
    payload.level = $('#levelField').val();
    payload.adv = $('#hasAdvInit').val();
    payload.speed = $('#speedField').val();
    payload.notes = $('#descriptionField').val();

    $.post('/data', payload, function(res) {
        if(!res.hasOwnProperty('err')) {
            $('#addCharacterForm').trigger('reset');
            $('#newCharacterModal').fadeOut();
        } else {
            logError('Error posting new character to server', res.err);
        }
    });
}

// ----------------------------------------------------------- MODAL CONTROL -----------------------------------------------------------

var editing = -1;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById('initModal')) {
        $("#initModal").fadeOut();
    }

    if (event.target == document.getElementById('newCharacterModal')) {
        $("#newCharacterModal").fadeOut();
    }
}

function openUpdateInitModal(id, name) {
    $("#newInitScoreFieldLabel").text(`Updating ${name}`);
    $("#initModal").fadeIn();
    editing = id;
}

function openNewCharacterModal() {
    $(`#newCharacterModal`).fadeIn();
}


const updateInitEvent = eventObj => {
    if(eventObj != undefined) {
        eventObj.preventDefault();
    }

    $.post('/initiative', {job: 'updateInit', which: editing, val: $("#newInitScoreField").val()}, function(res) {
        console.log(`Updating ${res.name}: INIT=${res.init}`);
    }).then(function() {
        prepareInitiativeList();
        editing = -1;
        $('#formUpdateInitScore').trigger('reset');
        $("#initModal").fadeOut();
    });
}
// --------------------------------------------------------- ENCOUTERS ------------------------------------------------------------------





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
loadView();