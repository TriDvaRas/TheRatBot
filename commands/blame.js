
const blame = require(`../functions/autoBlame`);
const logger = require("../logger");
let CDs = [];
module.exports = {
    aliases: ['blame', `bl`, `b`],
    description: 'Blame me!',
    help: '`blame`',
    execute: function (message, args) {
        if (checkCD(message.author))
            message.channel.send(`соси (кд)`)
        else {
            let men = message.mentions.users.first();
            if (men)
                message.channel.send(`${men} ${blame.getNewBlame()}`)
            else
                message.channel.send(`${message.author} ${blame.getNewBlame()}`)
            if (message.author.tag != `TriDvaRas#4805`) {
                CDs.push(`${message.author}`);
                let h = (4 + Math.random() * 6);
                setTimeout(() => removeCD(message.author), 3600000 * h)
                logger.log(`info`,`${message.author.tag} kd ${h}h`)

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