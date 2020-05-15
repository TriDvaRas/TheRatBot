//imports
var FF = require('./FileFunctions.js');
var Perm = require('./PermissionsFunctions.js');

module.exports = {
    name: 'reset',
    description: 'Resets current game state',
    help: '`!civ reset`',
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
        fs.writeFileSync('./commands/CivRandomizer/CurrentState.json', data, function (err) {
            if (err) {
                console.log(err);
            }
        });
        if (args != "auto")
            message.channel.send(`Game reset by ${message.author}`);
    },
};