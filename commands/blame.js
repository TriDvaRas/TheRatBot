const IO = require(`../functions/IO`);
const blame = require(`../functions/autoBlame`);
const logger = require("../logger");
const translatte = require('translatte');

let CDs = [];
module.exports = {
    aliases: ['blame', `bl`, `b`],
    description: 'Blame me!',
    help: '`blame`',
	channelName: `spam`,
    execute: function (message, args) {
        if (checkCD(message.author)) {
            message.delete({ timeout: 5000 })
            message.channel.send(`соси (кд)`).then(botMsg => botMsg.delete({ timeout: 5000 }))

        }
        else {
            let men = message.mentions.users.first();
            let b = blame.getNewBlame()
            translatte(b, {
                from: 'ru',
                to: 'uk',
            }).then(res => {
                logger.info(`- ${message.author.tag} ${b}`)
                logger.info(`+ ${message.author.tag} ${res.text}`)
                if (men) {
                    message.delete()
                    message.channel.send(`${men} ${res.text}`)
                    addStats(men)
                }
                else {
                    message.channel.send(`${message.author} ${res.text}`)
                    addStats(message.author)
                }
                if (message.author.tag != `TriDvaRas#4805`) {
                    CDs.push(`${message.author}`);
                    let h = (Math.random() * 4);
                    setTimeout(() => removeCD(message.author), 3600000 * h)
                    logger.log(`info`, `${message.author.tag} kd ${h}h`)
    
                }
            }).catch(err => {
                console.error(err);
            })
            
        }
    },
};


function checkCD(author) {
    return CDs.includes(`${author}`)
}
function removeCD(author) {
    CDs.splice(CDs.indexOf(`${author}`), 1);
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
    IO.Write(`./blameStats.json`, stats)
}