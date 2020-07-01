const monster_list = [];
const fetch = require('node-fetch');
var fs = require('fs');


for (var i = 1; i <= 22; i++) {
    (async () => {
        const body = {a: 1};

        const response = await fetch(`https://api.open5e.com/monsters/?page=${i}`, {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        });
        const json = await response.json();
        json.results.forEach(element => {
            monster_list.push(element);
        });
    })();
}

var millisecondsToWait = 5000;
setTimeout(function() {
    monster_list.sort();
    var str = JSON.stringify({"baddies": monster_list});
    fs.writeFile('monster_list.json', str, function (err) {
        if (err) return console.log(err);
    });
}, millisecondsToWait);


