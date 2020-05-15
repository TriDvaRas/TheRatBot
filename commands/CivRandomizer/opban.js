//imports 
var fs = require('fs');
var Perm = require('./PermissionsFunctions.js');
var FF = require('./FileFunctions.js');
module.exports = {
    name: 'opban',
    description: 'Bans Civilization by id or alias ignoring bans limit (OP)',
    help: '`!civ opban [Id/Alias]`',
    execute:async function(message, args) {
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
            //check if Player is OP
            if (!Perm.checkRoles(message, CurrState, true, true, false)) {
                message.reply("ахуел?(Op/Admin only)");
                return;
            }

            for (let j = 0; j < args.length && CheckCanBan(CurrState, message); j++) {
                let arg = args[j];
                //read list
                var CivList = FF.Read('./commands/CivRandomizer/CivList.json');

                //find civ by id
                C = CivList.find(x => x.id == arg);
                console.log(C);


                // if not found by id
                if (!C) {
                    C = [];
                    //find all aliases
                    CivList.forEach(civ => {
                        for (let i = 0; i < civ.Alias.length; i++) {
                            const A = civ.Alias[i];
                            if (A.includesIgnoreCase(arg)) {
                                C.push(civ);
                                console.log(A);

                                break;
                            }
                        }
                    });
                    //check if multiple
                    if (C.length > 1) {
                        let txt = `Multiple aliases for \`${arg}\`:`;
                        C.forEach(civ => {
                            txt += `\n${civ.id}. ${civ.Alias.join(` - `)}`
                        });
                        txt += "\nTry again";
                        message.channel.send(text);
                        return;
                    }
                    if (C.length == 1) {
                        C = C[0];
                    }
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
            //-------------------------------------------------------------------------

        }
        //write
        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
    },
};
//check if civ is banned
function CheckBanned(CurrState, C) {
    if (CurrState.banned.find(x => x == C.id)) {

        return true;
    }
    return false;
}
//remove civ from pool
function Ban(C, CurrState) {

    CurrState.Civs.splice(CurrState.Civs.findIndex(x => x == C.id), 1);
    CurrState.banned.push(C.id);

}
Array.prototype.includesIgnoreCase = function (value) {
    let LCvalue = value.toLowerCase();
    arr.forEach(E => {
        if (LCvalue == E.toLowerCase())
            return true;
    });
    return false;

}