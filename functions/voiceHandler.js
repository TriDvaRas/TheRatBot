const GSS = require(`google-spreadsheet`);
const logger = require("../logger");
const chalk = require("chalk");
const Discord = require(`discord.js`)
const creds = require(`../client_secret.json`);

module.exports = {
    checkMuteDay
}
let lastDay = 0;
function checkMuteDay(oldState, newState) {
    if (oldState.selfMute == newState.selfMute) return;

    let currDay = new Date().getDay();
    if (lastDay == currDay) return;
    //lastDay = currDay;

    let memberCount = newState.channel.members.reduce((accumulator, member) => accumulator + 1, 0)
    if (memberCount < 3) return;

    if (!newState.channel.members.every(member => member.voice.selfMute)) return;


    setTimeout(() => {
        newState.channel.fetch().then(channel => {
            if (channel.members.reduce((accumulator, member) => accumulator + 1, 0) < 3) return;
            if (!channel.members.every(member => member.voice.selfMute)) return;
            channel.guild.channels.cache.array().find(channel => channel.name == `main`).send(
                new Discord.MessageEmbed()
                    .setTitle(`ДЕНЬ МУТА!`)
                    .addField(`УЕБАНЫ:`, channel.members.reduce((accumulator, member) => accumulator + `${member.user}\n`, ``))
                    .setColor('#00dbb7')
                    .setTimestamp()
                    .setFooter('<-- KPblCA', 'https://tdr.s-ul.eu/hP8HuUCR')
            )
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
                date: `${date.getDay()}.${date.getMonth()+1}.${date.getFullYear()}`,
                uyoubkees: users
            }).then(row => {
                logger.log(`cmd`, `Added muteDay `)
            })
        });
    });
}