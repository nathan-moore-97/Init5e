
// --------------------------------------------------- VIEW CONTROLS -----------------------------------------------
const characters = []
var currentCharacter = null;
var viewingCharacter = null;

function loadView(state) {
    if(state != undefined) {
        // post the new state to the server
        $.post('/view', {viewState: state}, function(res){
            // TODO error checking
        });
    }
    // get the view state from the server
    $.get('/view', function(res){
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
    // Wipe initiative first
    $.post("/initiative", {job: "clear"}, function(res) {}).then(function() {
        // Query from the database to lookup the encounter
        $.get('/data', {what: `encounter`, name: en}, function(eRes) {
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
            $.get('/data', {what: `fight`, name: en}, function(fRes) {
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
                loadView('tracking');
            });
        });
    });
}

function prepareEncounterList() {
    $.get('/data', {what: 'encounter', id: -1}, function(res) {
        $('#encounterList').empty();
        res.forEach(function(elem) {
            $('#encounterList').append(
                `<a id="encounterListItem" class="list-group-item list-group-item-action bg-light" onclick="openEncounterWizard(\`${elem.encounter_name}\`)">${elem.encounter_name}</a>`
            );
        });
    });
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
                    <strong id="btnShowCharDetailsById" onclick="showDetails(${elem.id})">${elem.name}</strong>
                </li>`
            );        
        });
    });
}

// ----------------------------------------------------- Frontend Util functions ----------------------------------------------------- 

function logError(msg, specifics) {
    console.error(`INIT_5e | \t${msg}: '${specifics}'`);
}

function setCharacterDetails(char) {
    viewingCharacter = char;
    $(`#detailsCharName`).html(`<strong>Name: </strong>${char.name}`);
    $(`#detailsPlayerName`).html(`<strong>(${char.player})</strong>`);
    $(`#detailsCharDesc`).html(`<strong>Notes: </strong>${char.notes}`);
    
    if(!char.pc) {
        $(`#lookupBtn`).css(`display`, `block`);
        $(`#detailsAlignment`).html(`<strong>Alignment: </strong>${char.alignment}`);
        $(`#detailsClass`).html(`<strong>Class: </strong>${char.class}`);
    } else {
        $(`#lookupBtn`).css(`display`, `none`);
        $(`#detailsClass`).html(`<strong>Class: </strong>${char.class}`);
        $(`#detailsAlignment`).html(`<strong>Alignment: </strong>${char.alignment}`);
    }

    $(`#detailsRace`).html(`<strong>Race: </strong>${char.race}`);
    $(`#detailsLevel`).html(`<strong>Level: </strong>${char.level}`);
    $(`#detailsSpeed`).html(`<strong>Speed: </strong>${char.speed}`);

    $(`#detailsArmorClass`).html(`<strong>AC: </strong>${char.ac}`);
    $(`#detailsPassivePerception`).html(`<strong>PP: </strong>${char.passivePerception}`);
    $(`#detailsSaveDC`).html(`<strong>SDC: </strong>${char.saveDc}`);
}

// This function populates the "Currently" and "Up Next" fields on the jumbotron
// It also takes the response from the next request and places the information into 
// DM Dashboard
function upNext() {
    $.post(`/initiative`, {job: `next`}, function(res) {
        setCharacterDetails(res);
        currentCharacter = res;
        $(`#currentCharacter`).text(res.name);
        if (res.topOfOrder && $(`#rollAtTop`).prop(`checked`)) {
            $.post(`/initiative`, {job: 'shuffle', type: 'swap', pin: true}, function(res) {});
            prepareInitiativeList();
        }
    });

    $.post(`/initiative`, {job: `peek`}, function(res) {
        $(`#nextCharacter`).text(res[1].name);
    });
}

function lookupCurrent() {
    gotoMonster(viewingCharacter.class);
}

function sluggify(str) {
    return str.trim().toLowerCase().replace(/ /g, "-")
}

// Attempts to navigate the page to a monster sheet, that appears to be fairly complete. 
// This is one hell of a bodge but its the best thing I got without doing a shit ton of homework. 
function gotoMonster(meanie) {
    var open5eUrlBase = "";
    $.ajax({
        type: 'GET',
        url: `https://api.open5e.com/monsters/${sluggify(meanie)}`,
        success: function(data){
            window.open(`https://open5e.com/monsters/${sluggify(meanie)}`, "_blank");
        },
        error: function(data){
           window.open(`https://jsigvard.com/dnd/monster.php?m=${meanie}`, `_blank`);
        },
    });
}

function showDetails(charId) {
    $.get('/initiative', {id: charId}, function(res){
        console.log(res);
        setCharacterDetails(res);
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

const postNewEncounterToDatabase = eventObj => {
    eventObj.preventDefault();
    var payload = {job: `create`, what: `encounter`};
    payload.name = $(`#encounterNameField`).val();
    payload.description = $(`#encounterDescriptionField`).val();

    $.post('/data', payload, function(res) {
        if(!res.hasOwnProperty('err')) {
            $('#addEncouterForm').trigger('reset');
            $('#newEncounterModal').fadeOut();
            prepareEncounterList();
        } else {
            logError('Error posting new encounter to server', res.err);
        }
    });
}

const searchDatabaseForCharacter = eventObj => {
    eventObj.preventDefault();
    $('#lookupCombatantList').empty();
    var lookup = $('#searchDatabaseForCharacterField').val();
    console.log(lookup);
    $.get(`/data`, {what: `character`, name: lookup}, function(res){
        if(res.err != undefined) {
            console.log(res);
        } else {
            res.forEach(elem => {
                $('#lookupCombatantList').append(
                    `<a id="combatantListItem" name="${sluggify(elem.char_name)}" class="list-group-item list-group-item-action bg-light" onclick="selectLookupCombatant(${elem.character_id})">${elem.char_name}</a>`
                );
            });
        }
    });
}

const postNewCharacterToDatabase = eventObj => {
    eventObj.preventDefault();
    var payload = {job: 'create', what: 'character'};

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
    payload.notes = $('#characterDescriptionField').val();

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

    if(event.target == document.getElementById('newEncounterModal')) {
        $('#newEncounterModal').fadeOut();
    }
}

function openUpdateInitModal(id, name) {
    $("#newInitScoreFieldLabel").text(`Updating ${name}`);
    $("#initModal").fadeIn();
    editing = id;
}

function openNewEncounterModal() {
    $(`#newEncounterModal`).fadeIn();
}

function openNewCharacterModal() {
    $(`#newCharacterModal`).fadeIn();
}


const updateInitEvent = eventObj => {
    if(eventObj != undefined) {
        eventObj.preventDefault();
    }

    $.post('/initiative', {job: 'updateInit', which: editing, score: $("#newInitScoreField").val()}, function(res) {
        // Discard result for now
    }).then(function() {
        prepareInitiativeList();
        editing = -1;
        $('#formUpdateInitScore').trigger('reset');
        $("#initModal").fadeOut();
    });
}
// --------------------------------------------------------- ENCOUNTERS ------------------------------------------------------------------

var stagedCombatants = [];
var currentEncounter = -1;

function openEncounterWizard(en) {
    $(`#combatantList`).empty();

    var pkt = {what: 'encounter', name: en};

    if(!isNaN(parseInt(en))) {
        pkt = {what: 'encounter', id: en}
    }

    $.get('/data', pkt, function(eRes) {
        // Discard result for now, send it to the .then() function.
    }).then(function(eRes) {
        // Check if the encounter is good
        if (eRes.hasOwnProperty('err')) {
            logError(eRes.err, en);
            return;
        }
        currentEncounter = eRes[0].encounter_id;
        $(`#wizardTitle`).text(eRes[0].encounter_name);
        $(`#wizardDescription`).text(eRes[0].encounter_notes);
        $(`#startCombatButton`).attr(`onclick`,`loadEncounter(\`${eRes[0].encounter_name}\`)`);
        // Try to get fight details
        $.get('/data', {what: `fight`, name: eRes[0].encounter_name}, function(fRes) {
            // Check if the fight actually exists
            if (fRes.hasOwnProperty('err')) {
                logError(`Error retrieving fight after good encounter, ${fRes.err}`, en);
                return;
            }
            fRes.forEach(elem => {
                $('#combatantList').append(
                    `<a id="combatantListItem" class="list-group-item list-group-item-action bg-light" onclick="">${elem.char_name}</a>`
                ); 
            });
        }).then(function() {});
    });
}

function selectLookupCombatant(lookupCharacterId) {
    $.get('/data', {what: `character`, id: lookupCharacterId}, function(res) {
        var ahtml = $(`a[name ="${sluggify(res[0].char_name)}"]`);
        // Highlight the selected character
        if (!ahtml.hasClass('selected')) {
            ahtml.addClass('selected');
        } else {
            ahtml.removeClass('selected');
        }

        $('#addLookupCharacter').attr(`onclick`,`addCharacterToEncounter(\`${res[0].character_id}\`)`);
        $('#addLookupCharacterAlias').attr(`onclick`,`addAliasedCharacterToEncounter(\`${res[0].character_id}\`)`);
        $('#deleteLookupCharacter').attr(`onclick`,`deleteCharacterFromDatabase(\`${res[0].character_id}\`)`);

    });
}

function addCharacterToEncounter(characterId) {
    $.get('/data', {what: `character`, id: characterId}, function(res) {
        console.log(res)
        var result = res[0];
        console.log(`Add to encounter: ${result.char_name}`);
        stagedCombatants.push(result.character_id);
        $("#stagedCombatantList").append(`<li>${result.char_name}</li>`)
        $(`#${sluggify(result.char_name)}`).css('background-color', '#ebedef');
        $("#commitToFightBtn").prop('disabled', false);
    });
}

function addAliasedCharacterToEncounter(characterId) {
    $.get('/data', {what: `character`, id: characterId}, function(res) {
        console.log(res)
        var result = res[0];
        console.log(`Add alias to DB and to encounter: ${result.char_name}`);
        $(`#${sluggify(result.char_name)}`).css('background-color', '#ebedef');
    });
}

function deleteCharacterFromDatabase(characterId) {
    $.get('/data', {what: `character`, id: characterId}, function(res) {
        console.log(res)
        var result = res[0];
        console.log(`Remove character from DB: ${result.char_name}`);
        $(`#${sluggify(result.char_name)}`).css('background-color', '#ebedef');
    });
}

function commitToFight() {
    var fightReq = {
        job: `create`,
        what: `fight`,
        encounterId: currentEncounter,
        characterIdList: stagedCombatants
    }

    $.post(`/data`, fightReq, function(res) {
        console.log(fightReq);
        if(res.err != undefined) {
            console.log(res);
        } else {
            stagedCombatants = [];
            $("#commitToFightBtn").prop('disabled', true);
        }
    }).then(function () {
        openEncounterWizard(currentEncounter);
    });
   
}

// ---------------------------------------------------------- SOCKET IO -----------------------------------------------------------------
$(function () {
    var socket = io();
    socket.on('ping', function(payload){
        if (payload != undefined) {
            $('#stream').text(payload);
        }
    });

    socket.on('init', function(payload) {
        if(payload != undefined) {
            prepareInitiativeList();
            $('#stream').text(`${payload.which} set init to ${payload.score}`);
        }
    });

    socket.on('refresh', function(payload) {
        if(payload != undefined) {
            prepareInitiativeList();
        }
    });
});



// ------------------------------------------------------------- SETUP -----------------------------------------------------------------
console.log("Welcome to the ChaosEngine Initiative Tracker!");
loadView();
openEncounterWizard(`New Monster Test`);