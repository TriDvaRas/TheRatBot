
var fs = require('fs');
const mergeImg = require('merge-img');
var Perm = require('./PermissionsFunctions.js');
module.exports = {
    name: 'get',
    description: 'CivRandomizer GetCiv',
    help: 'No help here(',
    execute:async function(message, args) {
        //read
        var data = fs.readFileSync('./commands/CivRandomizer/CurrentState.json', "utf8");
        var CurrState = JSON.parse(data);
        //check permissions
        if (!Perm.checkRoles(message, CurrState, false, false, true)) {
            message.reply("ахуел?(CivRole only)");
            return;
        }
        //check game state
        if (CurrState.started != "true") {
            message.channel.send("`!start` game first");
        }
        if (CurrState.mode != "manual") {
            message.channel.send("manual game only");
        }
        var data1 = fs.readFileSync("./commands/CivRandomizer/CivList.json", "utf8");
        var CivList = JSON.parse(data1);

        //console.log(CivList);
        if (args.length != 0) {
            cnt = Math.min(args[0], 6);
            txt = "\n";
            images = [];
            for (let i = 0; i < cnt; i++) {
                Id = getRandomInt(1, 43);
                txt += `${CivList[Id - 1].Name}/`
                images.push(`./commands/CivRandomizer/${CivList[Id - 1].picPath}`);
            }

            mergeImg(images)
                .then((img) => {
                    img.write(`./commands/CivRandomizer/Imgs/Players/${message.author.tag}.png`, () => {
                        message.reply(txt.slice(0, -1), {
                            file: `./commands/CivRandomizer/Imgs/Players/${message.author.tag}.png`
                        });
                    });

                });
            return;
        }
        Id = GetRandomCivId(CurrState.Civs, CurrState.repeat);

        message.reply(CivList[Id].Name, {
            file: `./commands/CivRandomizer/${CivList[Id].picPath}`
        });

        //write
        fs.writeFile('./commands/CivRandomizer/CurrentState.json', JSON.stringify(CurrState, null, 2), function (err) {
            if (err) {
                console.log(err);
            }
        });


    },
};
function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}
function GetRandomCivId(Pool, RemoveFromPool) {
    i = getRandomInt(0, Pool.length - 1);
    n = Pool[i];
    if (RemoveFromPool)
        Pool.splice(i, 1);
    return n;
}