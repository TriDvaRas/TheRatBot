//imports 
var fs = require('fs');
var Perm = require('./PermissionsFunctions.js');
var FF = require('./FileFunctions.js');
module.exports = {
    name: 'opban',
    description: 'Bans Civilization by id or alias ignoring bans limit (OP)',
    help: '`!civ opban [Id/Alias]`',
    execute: async function (message, args) {
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

            for (let j = 0; j < args.length; j++) {
                let arg = args[j];
                //read list
                var CivList = FF.Read('./commands/CivRandomizer/CivList.json');

                //find civ by id
                C = CivList.find(x => x.id == arg);


                // if not found by id
                if (!C) {
                    C = [];
                    //find all aliases
                    CivList.forEach(civ => {

                        if (includesIgnoreCase(civ.Alias, arg)) {
                            C.push(civ);
                        }
                    });
                    //check if multiple
                    if (C.length > 1) {
                        let txt = `Multiple aliases for \`${arg}\`:`;
                        C.forEach(civ => {
                            txt += `\n${civ.id}. ${civ.Alias.join(` - `)}`
                        });
                        message.channel.send(txt);
                        return;
                    }
                    if (C.length == 1) {
                        C = C[0];
                    }
                }
                console.log(C);


                //if found 
                if (C) {
                    //check not if banned
                    if (!CheckBanned(CurrState, C)) {
                        Ban(C, CurrState);

                        message.channel.send(`${message.author} opbanned ${C.Name} (${C.id})`, {
                            file: `./commands/CivRandomizer/${C.picPath}`
                        });
                        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
                    } else {
                        message.send(`${message.author} ${C.Name} (${C.id}) is already banned `, {
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
function includesIgnoreCase(arr, value) {
    let LCvalue = value.toLowerCase();
    let found = false;
    for (let i = 0; i < arr.length; i++) {
        const E = arr[i];
        if (E.toLowerCase().includes(LCvalue)) {
            found = true;
        }
    }
    return found;
}