const GSS = require(`google-spreadsheet`);
const logger = require("../logger");
const Discord = require(`discord.js`)
const creds = require(`../client_secret.json`);
const HAA = require(`../commands/muteSync`)
const numToStr = require(`./numToStr`)

module.exports = {
    checkMuteDay,
    checkMuteAll,
    checkNZ,
}




function checkNZ(oldState, newState) {
    if (!global.nz)
        return

    for (const mem of global.NZmems) {
        let host = newState.guild.members.cache.get(`${mem.id}`)
        let hostVS = host.voice
        if (newState.channelID != hostVS.channelID && oldState.channelID != hostVS.channelID)
            continue
        if (!hostVS?.channel) {
            host.setNickname(message.member.setNickname(mem.oldName))
            global.NZmems.splice(global.NZmems.indexOf(mem), 1)
            continue
        }
        if (mem.cnt == hostVS.channel.members.size)
            continue
        mem.cnt = hostVS.channel.members.size
        host.setNickname(getNZName(hostVS.channel.members.size))
    }


}

function getNZName(memCnt) {
    if (memCnt == 1)
        return `Я здесь один`
    else
        return `Нас здесь ${numToStr(memCnt)}`
}

function checkMuteAll(oldState, newState) {
    if (oldState.selfMute == newState.selfMute) return;
    HAA.update(oldState, newState)
}

let lastDay = -1;
function checkMuteDay(oldState, newState) {
    if (oldState.selfMute == newState.selfMute) return;

    let currDay = new Date().getDay();
    if (lastDay == currDay) return;
    lastDay = currDay;

    let memberCount = newState.channel.members.size
    if (memberCount < 3) return;
    if (!newState.channel.members.every(member => member.voice.selfMute)) return;
    logger.log(`info`, `Starting mute day count down`);


    setTimeout(() => {
        logger.log(`info`, `Checking if still muted`);
        newState.channel.fetch().then(channel => {
            if (channel.members.size < 3) return;
            if (!channel.members.every(member => member.voice.selfMute)) return;
            channel.guild.channels.cache.array().find(channel => channel.name == `main`).send(
                new Discord.MessageEmbed()
                    .setTitle(`ДЕНЬ МУТА!`)
                    .addField(`УЕБАНЫ:`, channel.members.reduce((accumulator, member) => accumulator + `${member.user}\n`, ``))
                    .setColor('#00dbb7')
                    .setTimestamp()
                    .setFooter('<-- KPblCA', 'https://tdr.s-ul.eu/hP8HuUCR')
            ).then(() => {

                logger.log(`info`, `Sent mute day msg`);
            })
            appendSheet(channel.members.reduce((accumulator, member) => accumulator + `${member.user.tag}\n`, ``))
        })
    }, 60000)

}



function appendSheet(users) {
    const doc = new GSS.GoogleSpreadsheet(`1Ja0d5GCKhkNeOo2UhV7sIQegCo32bIlSqbB76aBHPxI`);
    doc.useServiceAccountAuth(creds).then(() => {
        doc.getInfo().then(() => {
            const sheet = doc.sheetsByIndex[2];
            logger.log(`info`, `Fetched sheet ${sheet.title} ${sheet.columnCount}:${sheet.rowCount}`);
            let date = new Date();
            sheet.addRow({
                date: `${date.getDay()}.${date.getMonth() + 1}.${date.getFullYear()}`,
                uyoubkees: users
            }).then(row => {
                logger.log(`sheet`, `Added muteDay `)
            })
        });
    });
}