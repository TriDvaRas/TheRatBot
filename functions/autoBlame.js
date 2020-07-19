const IO = require(`../functions/IO`);
module.exports = blame;
function blame() {
    let subs = IO.Read(`./assets/subscribers.json`);
    let parts = IO.Read(`./assets/phraseParts.json`);
    let phrase = "";
    if (Math.random() < 0.3)
        phrase += "ало ";

    phrase += parts.first[Math.floor(Math.random() * parts.first.length)] + ` `;
    phrase += parts.second[Math.floor(Math.random() * parts.second.length)] + ` `;
    let r = Math.random();
    let n;
    if (r > 0.40) {
        n = 1;
    } else if (r > 0.10) {
        n = 2;
    } else {
        n = 3;
    }
    for (let i = 0; i < n; i++) {
        let third = parts.third[Math.floor(Math.random() * parts.third.length)]
            .replace("{n}", Math.floor(Math.random() * 6))
            .replace("{N}", Math.floor(Math.random() * 10000))
            .replace("{ava}", avaGenerator(parts))
            + ` `;
        phrase += third;
    }
    //--------------------------------------------------------------------------------------
    globalThis.client
        .guilds.cache.array().find(x => x.name == `3425`)
        .channels.cache.array().find(x => x.name == `main`)
        .send(`<@${subs[Math.floor(Math.random() * subs.length)]}> ${phrase}`)

    setTimeout(blame, 3600000 * (12 + Math.random() * 24))
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