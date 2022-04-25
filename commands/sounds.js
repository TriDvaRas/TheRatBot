const GSS = require(`google-spreadsheet`);
const logger = require("../logger");
const chalk = require("chalk");
const Discord = require(`discord.js`)
const creds = require(`../client_secret.json`);
const weight = require(`../assets/ratQWeight.json`);

module.exports = {
    aliases: [`soundboard`, `sound`, `sounds`, `sb`],
    description: `Sounds list`,
    help: `\`sounds\``,
    execute
};

async function execute(message, args) {
    message.channel.send(
        new Discord.MessageEmbed()
            .setColor('#db00d0')
            .setDescription("**[Rat Sounds List](https://docs.google.com/spreadsheets/d/e/2PACX-1vQ32Wh0zG4DJ76zQFffqH58OaXS1tdSDmwBuOfTGqbe1TFsGWSGhTEmdr0fuIVC-Jh5Te_gi9AYAvas/pubhtml?gid=518097663&single=true)**")
            .setTimestamp()
            .setFooter('<-- rat', 'https://tdr.s-ul.eu/hP8HuUCR')
    )

}


