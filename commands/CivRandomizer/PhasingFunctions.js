module.exports = {
    StartBans: function StartBans(CurrState, message, bSize) {
        message.channel.send(' **- Bans phase -** \n`!civ ban [civId/civName]` to ban\n`!civ bansEnd` to finish bans phase(Op-only)\n`!civ list` for civ list(ахуеть)');
        CurrState.Phase = "bans";
    },
    StartPicks: function StartPicks(CurrState, message) {
        CurrState.Phase = "picks";
        if (CurrState.mode == "manual") {
            message.channel.send(" **- Pick phase -** \nUse `!civ get [Count]`");
        } else {
            message.channel.send(" **- Pick phase -** ");
        }
        GeneratePicks(CurrState, message);
    },
    StartJoins: function StartJoins(CurrState, message) {//`!civ joinSkip <PlayerCount>` to skip phase(Op-only)\n
        message.channel.send(' **- Join phase -** \n`!civ join` to join game\n`!civ joinEnd` to end phase(Op-only)');
        CurrState.Phase = "join";
    }
}
//IO system
var FF = require('./FileFunctions.js');
//gen and send all picks
function GeneratePicks(CurrState, message) {
    shuffle(CurrState.Players, CurrState.PlayersId);
    for (let i = 0; i < CurrState.PlayersId.length; i++) {
        GetCivLine(CurrState, message, CurrState.Players[i], CurrState.PlayersId[i]);

    }
}
//get player civ set
function GetCivLine(CurrState, message, Player, PlayerId) {
    const mergeImg = require('merge-img');
    var CivList = FF.Read('./commands/CivRandomizer/CivList.json');
    let txt = `${PlayerId}:\n`;
    images = [];
    for (let i = 0; i < CurrState.playerSize; i++) {
        Id = GetRandomCivId(CurrState);
        txt += `${CivList[Id-1].Name}/`;
        images.push(`./commands/CivRandomizer/${CivList[Id-1].picPath}`);
    }
    mergeImg(images)
        .then((img) => {
            img.write(`./commands/CivRandomizer/Imgs/Players/${Player}.png`, () => {
                message.channel.send(txt.slice(0, -1), {
                    file: `./commands/CivRandomizer/Imgs/Players/${Player}.png`
                });
            });

        });
        console.log(CurrState.repeat == true);
    if (CurrState.repeat == true)
        for (let i = CurrState.picked.length - 1; i >= 0; i--) {
            CurrState.Civs.push(CurrState.picked.splice(i, 1)[0]);
        }
    return;
}
//civ id from pool
function GetRandomCivId(CurrState) {//Pool, RemoveFromPool
    i = getRandomInt(0, CurrState.Civs.length - 1);
    n = CurrState.Civs[i];
    CurrState.picked.push(CurrState.Civs.splice(i, 1)[0]);
    return n;
}
//rng
function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}
//array shuffle
function shuffle(Players, PlayerIds) {
    for (let i = Players.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [Players[i], Players[j]] = [Players[j], Players[i]];
        [PlayerIds[i], PlayerIds[j]] = [PlayerIds[j], PlayerIds[i]];
    }
}