var FF = require('./FileFunctions.js');
var Phaser = require('./PhasingFunctions.js');
module.exports = {
    name: 'bansSkip',
    description: 'CivRandomizer bansSkip',
    help: 'No help here(',
    execute(message, args) {
        //read GameState
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        //check phase
        if (CurrState.started != "true") {
            message.channel.send("`!start` game first");
            return;
        } else if (CurrState.Phase != "bans") {
            message.channel.send("Wrong phase");
            return;
            //----
        } else if (CurrState.started == "true" && CurrState.Phase == "bans") {
            if (message.author != CurrState.Op) {
                message.reply("Op-only command");
                return;
            }
            //start picks
            
            Phaser.StartPicks(CurrState, message);

        }
    },
};