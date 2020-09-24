const IO = require(`../functions/IO`);
const blame = require(`../functions/autoBlame`);
const logger = require("../logger");
let CDs = [];
module.exports = {
    aliases: ['blame', `bl`, `b`],
    description: 'Blame me!',
    help: '`blame`',
    execute: function (message, args) {
        if (checkCD(message.author)) {
            message.delete({ timeout: 5000 })
            message.channel.send(`соси (кд)`).then(botMsg => botMsg.delete({ timeout: 5000 }))

        }
        else {
            let men = message.mentions.users.first();
            if (men) {
                message.delete()
                message.channel.send(`${men} ${blame.getNewBlame()}`)
                addStats(men)
            }
            else {
                message.channel.send(`${message.author} ${blame.getNewBlame()}`)
                addStats(message.author)
            }
            if (message.author.tag != `TriDvaRas#4805`) {
                CDs.push(`${message.author}`);
                let h = (Math.random() * 4);
                setTimeout(() => removeCD(message.author), 3600000 * h)
                logger.log(`info`, `${message.author.tag} kd ${h}h`)

            }
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