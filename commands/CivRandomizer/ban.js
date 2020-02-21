var FF = require('./FileFunctions.js');
var Phaser = require('./PhasingFunctions.js');
module.exports = {
    name: 'ban',
    description: 'CivRandomizer ban',
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

        } else if (CurrState.started == "true" && CurrState.Phase == "bans") {
            //check if Player can ban
            if (!CheckCanBan(CurrState, message)) {
                message.reply("Out of bans");
                return;
            }
            //check if skip
            if (args[0] == "skip") {
                for (let i = 0; i < CurrState.banSize; i++) {
                    CurrState.Banners.push(`${message.author}`);
                    CurrState.bansActual = parseInt(CurrState.bansActual) + 1;
                }
                message.channel.send(message.author + " skipped bans");
                FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
                CheckBansEnd(CurrState, message);
                return;
            }
            //read list
            var CivList = FF.Read('./commands/CivRandomizer/CivList.json');
            //find civ by args
            C = CivList.find(x => x.id == args[0]);
            if (!C) {
                C = CivList.find(x => x.Name == args[0]);
            }
            //if found 
            if (C) {
                //check if banned
                if (!CheckBanned(CurrState, C)) {
                    Ban(C, CurrState);
                    CurrState.Banners.push(`${message.author}`);
                    message.channel.send(`${message.author} banned ${C.Name} (${C.id})\nBans: ${CurrState.bansActual}/${CurrState.bansFull}`, {
                        file: `./commands/CivRandomizer/${C.picPath}`
                    });
                    FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
                    sleep(200).then(() => {
                        CheckBansEnd(CurrState, message);
                    });
                    sleep(200).then(() => {
                        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
                    });
                } else {
                    message.reply(`${C.Name} (${C.id}) is already banned `, {
                        file: `./commands/CivRandomizer/${C.picPath}`
                    });
                }
            }
        }

    },
};
function CheckBanned(CurrState, C) {
    if (CurrState.banned.find(x => x == C.id)) {

        return true;
    }
    return false;
}
function Ban(C, CurrState) {
    CurrState.bansActual = parseInt(CurrState.bansActual) + 1;
    CurrState.Civs.splice(CurrState.Civs.findIndex(x => x == C.id), 1);
    CurrState.banned.push(C.id);

}
function CheckCanBan(CurrState, message) {
    n = 0;
    for (let i = 0; i < CurrState.Banners.length; i++) {
        if (CurrState.Banners[i] == message.author)
            n++;
        if (n >= CurrState.banSize)
            return false;
    }
    return true;
}
function CheckBansEnd(CurrState, message) {
    if (CurrState.bansActual >= CurrState.bansFull) {

        Phaser.StartPicks(CurrState, message);
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}