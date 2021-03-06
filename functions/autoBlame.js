const IO = require(`../functions/IO`);
const logger = require("../logger");
let fetch = require(`node-fetch`)

module.exports = {
    blameRandom,
    getNewBlame
}

globalThis.Games = []
getGameList()

function blameRandom() {
    let subs = IO.Read(`./assets/subscribers.json`);
    let sub = subs[Math.floor(Math.random() * subs.length)];
    let phrase = `<@${sub}> **${getNewBlame()}**`;
    globalThis.client
        .guilds.cache.array().find(x => x.name == `Future Foundation`)//
        .channels.cache.array().find(x => x.name == `spam`)
        .send(`${phrase}`)
    let hours = (12 + Math.random() * 12);
    logger.log(`info`, `Next blame in ${hours}h`)

    addStats(globalThis.client
        .guilds.cache.array().find(x => x.name == `Future Foundation`)
        .members.cache.array().find(x => x.id == sub).user);
    setTimeout(blameRandom, 3600000 * hours)
}

function getNewBlame() {
    let parts = IO.Read(`./assets/phraseParts.json`);
    let phrase = ""
    if (Math.random() < 0.45)
        phrase += parts.prefix[Math.floor(Math.random() * parts.prefix.length)] + `, `;

    phrase += parts.first[Math.floor(Math.random() * parts.first.length)] + ` `;
    phrase += parts.second[Math.floor(Math.random() * parts.second.length)] + `, `;
    let r = Math.random();
    let n;
    if (r > 0.40)
        n = 1;
    else if (r > 0.10)
        n = 2;
    else
        n = 3;
    for (let i = 0; i < n; i++) {
        let third = parts.third[Math.floor(Math.random() * parts.third.length)]
            .replace("{n}", Math.floor(Math.random() * 7))
            .replace("{N}", Math.floor(Math.random() * 10000))
            .replace("{ava}", avaGenerator(parts))
            .replace("{first}", parts.first[Math.floor(Math.random() * parts.first.length)])
            .replace("{second}", parts.second[Math.floor(Math.random() * parts.second.length)]);
        if (i < n - 1)
            third += `, `
        else
            third += ` `
        if (third.includes(`{game}`)) {
            third = third.replace(`{game}`, `${getGame()}`)
        }
        phrase += third;
    }
    return phrase;
}

function avaGenerator(parts) {
    let r = Math.random();
    let n;
    if (r > 0.35) {
        n = 1;
    } else {
        n = 2;
    }
    let str = ``
    for (let i = 0; i < n; i++) {
        if (Math.random() < 0.40) {
            str += parts.second[Math.floor(Math.random() * parts.second.length)] + ` `;
        }
        else {
            str += parts.ava[Math.floor(Math.random() * parts.ava.length)] + ` `;
        }
    }
    return str;
}

function addStats(User) {
    let stats = IO.Read(`./blameStats.json`)
    let user = stats.users.find(u => u.tag == `<@!${User.id}>`)
    if (!user) {
        stats.users.push({
            tag: `<@!${User.id}>`,
            blames: 1,
            name: User.tag
        });

    } else {
        user.blames += 1;
    }
    stats.auto += 1;
    IO.Write(`./blameStats.json`, stats)
}
function getGameList() {
    fetch("http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json")
        .then(res => res.json(),)
        .then(json => {
            Games = json.applist.apps.map(g => g.name)
            logger.log(`info`, `Updated games list games: ${Games.length}`)
            if (Games.length == 0)
                setTimeout(getGameList, 300000)
            else
                setTimeout(getGameList, 3600000 * 24)

        })
}
function getGame() {
    if (Games.length == 0)
        return `доту`
    return Games[Math.floor(Math.random() * Games.length)]
}

