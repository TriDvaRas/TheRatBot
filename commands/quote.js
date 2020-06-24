const GSS = require(`google-spreadsheet`);
const logger = require("../logger");
const chalk = require("chalk");
const Discord=require(`discord.js`)
const creds = require(`../client_secret.json`);

module.exports = {
    aliases: [`quote`, `q`],
    description: `Quote`,
    help: `\`quote add <author> | <quote>\`
\`quote get [author/id]\`
\`quote count [author/id]\`
\`quote list/all\``,
    execute
};

async function execute(message, args) {
    try {
        let mode = args.shift();
        if ([`list`, `all`].includes(mode)) {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor('#db00d0')
                    .setDescription("**[Quotes List](https://docs.google.com/spreadsheets/d/e/2PACX-1vQ32Wh0zG4DJ76zQFffqH58OaXS1tdSDmwBuOfTGqbe1TFsGWSGhTEmdr0fuIVC-Jh5Te_gi9AYAvas/pubhtml?gid=518097663&single=true)**")
                    .setTimestamp()
                    .setFooter('<-- rat', 'https://tdr.s-ul.eu/hP8HuUCR')
            ).then(
                logger.log(`cmd`, `Sent quotes list`)
            );
            return;
        }
        if (![`add`, `get`, `count`].includes(mode)) {
            message.reply(`Wrong arguments: \`${mode}\``);
            return;
        }
        logger.log(`info`, `Fetching sheet...`)
        const doc = new GSS.GoogleSpreadsheet(`1Ja0d5GCKhkNeOo2UhV7sIQegCo32bIlSqbB76aBHPxI`);
        doc.useServiceAccountAuth(creds).then(() => {
            doc.getInfo().then(() => {
                const sheet = doc.sheetsByIndex[1];
                logger.log(`info`, `Fetched sheet ${sheet.title} ${sheet.columnCount}:${sheet.rowCount}`);
                if (mode == `count`) {
                    sheet.getRows().then(rows => {
                        if (args[0])
                            rows = rows.filter(x => x.author.toLowerCase().includes(args[0].toLowerCase()) || x.id == args[0]);
                        message.channel.send(`Quotes count: ${rows.length}`).then(
                            logger.log(`cmd`, `Sent quotes count`)
                        );
                    });
                }
                else if (mode == `add`) {
                    args = args.join(` `)
                    if (!args.includes(`|`)) {
                        message.reply(`Wrong arguments: no \`|\` found`);
                        return;
                    }
                    args = args.replace(` |`, `|`).replace(`| `, `|`).split(`|`);
                    if (args.length > 2) {
                        message.reply(`Wrong arguments: more than 1 \`|\` found`);
                        return;
                    }
                    let date = new Date();
                    sheet.addRow({
                        id: sheet.rowCount,
                        date: `${date.toUTCString()}`,
                        author: args[0],
                        quote: args[1]
                    }).then(row => {
                        message.channel.send(`Added quote #${row.id}\n\`${row.quote}\`\n©**${row.author}**`).then(
                            logger.log(`cmd`, `Added quote #${row.id}`)
                        );
                    })

                }
                else if (mode == `get`) {
                    sheet.getRows().then(rows => {
                        if (args[0])
                            rows = rows.filter(x => x.author.toLowerCase().includes(args[0].toLowerCase()) || x.id == args[0]);
                        let row = rows[Math.floor(Math.random() * rows.length)];
                        message.channel.send(`Quote #${row.id}\n\`${row.quote}\`\n©**${row.author}**`).then(
                            logger.log(`cmd`, `Sent Quote #${row.id}`)
                        );
                    });
                }
            });
        });
    } catch (error) {
        logger.log(`error`, `${error}`)

    }

}

function add(author, quote) {

}

