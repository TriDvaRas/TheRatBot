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
            .setDescription("**[Rat Sounds List](https://github.com/TriDvaRas/TheRatBot/tree/UA/sounds)**")
            .setTimestamp()
            .setFooter('<-- rat', 'https://tdr.s-ul.eu/hP8HuUCR')
    )

}


