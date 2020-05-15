//imports
var FF = require('./FileFunctions.js');
var Perm = require('./PermissionsFunctions.js');

module.exports = {
    name: 'reset',
    description: 'CivRandomizer reset',
    help: 'No help here(',
    execute:async function(message, args) {
        //read game state
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        //check permissions
        if (!Perm.checkRoles(message, CurrState, true, true, false)) {
            message.reply("ахуел?(Op/Admin only)");
            return;
        }
        var fs = require('fs');
        var data = fs.readFileSync('./commands/CivRandomizer/BaseState.json', "utf8");
        fs.writeFile('./commands/CivRandomizer/CurrentState.json', data, function (err) {
            if (err) {
                console.log(err);
            }
        });
        message.channel.send(`Game reset by ${message.author}`);
    },
};