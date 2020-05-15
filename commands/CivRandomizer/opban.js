//imports 
var fs = require('fs');
var Perm = require('./PermissionsFunctions.js');

module.exports = {
    name: 'opban',
    description: 'CivRandomizer forceban',
    help: 'No help here(',
    execute:async function(message, args) {
        //read GameState
        var data = fs.readFileSync('./commands/CivRandomizer/CurrentState.json', "utf8");
        var CurrState = JSON.parse(data);
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
            //read list
            var data1 = fs.readFileSync("./commands/CivRandomizer/CivList.json", "utf8");
            var CivList = JSON.parse(data1);
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
                    message.channel.send(`Banned ${C.Name} (${C.id})`, {
                        file: `./commands/CivRandomizer/${C.picPath}`
                    });
                } else {
                    message.reply(`${C.Name} (${C.id}) is already banned `, {
                        file: `./commands/CivRandomizer/${C.picPath}`
                    });
                }
            }
        }
        //write
        fs.writeFile('./commands/CivRandomizer/CurrentState.json', JSON.stringify(CurrState, null, 2), function (err) {
            if (err) {
                console.log(err);
            }
        });
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