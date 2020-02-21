var FF = require('./FileFunctions.js');
var Phaser = require('./PhasingFunctions.js');
var Perm = require('./PermissionsFunctions.js');
module.exports = {
    name: 'start',
    description: 'CivRandomizer Game Start',
    help: 'Usage:\n `!civ start auto [CivPerPlayer(1-6)] <BansPerPlayer>`\n `!civ start manual <BansPerPlayer>`',
    execute(message, args) {
        if (args.length > 0) {
            //read
            var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
            //check civ role
            if (!Perm.checkRoles(message, CurrState, false, false, true)) {
                message.reply("ахуел?(CivRole only)");
                return;
            }
            //start game
            StartGame(message, args, CurrState);
            //write
            FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
            return;
        }
        message.channel.send(this.help);
    },
};
function StartGame(message, args, CurrState) {
    //check if game is started
    if (CurrState.started == 'true') {
        message.reply("Game is already started");
        return;
    }
    //set game state
    CurrState.Op = `${message.author}`
    //manual
    if (args[0] == "manual" || args[0] == "m") {

        CurrState.mode = "manual";
        CurrState.started = "true";
        message.channel.send(`Game started. Op - ${message.author}`);
        //check for bans
        //start bans
        if (args[1] > 0) {
            Phaser.StartBans(CurrState, message, args[1]);
            CurrState.banSize = args[1];
        }//start picks
        else {
            Phaser.StartPicks(CurrState, message)
            CurrState.banSize = 0;
        }
        return;
        //auto
    }//auto 
    else if (args[0] == "auto" || args[0] == "a") {
        CurrState.mode = "auto";

        //check CPP
        if (!args[1] || !parseInt(args[1]) || parseInt(args[1]) < 1 || parseInt(args[1]) > 6) {
            message.channel.send("Wrong arguments");
            message.channel.send(this.help);
            return;
        }
        CurrState.playerSize = parseInt(args[1]);
        CurrState.started = "true";
        message.channel.send(`Game started. Op - ${message.author}`);
        //Start join phase
        Phaser.StartJoins(CurrState, message);
        //check for bans
        if (args[2] > 0) {
            CurrState.banSize = args[2];
        } else {
            CurrState.banSize = 0;
        }
        return;
    }else {
        message.channel.send(`Game start failed.`);
    }
}
