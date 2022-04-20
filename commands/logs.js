const IO = require(`../functions/IO`);
const blame = require(`../functions/autoBlame`);
const logger = require("../logger");
const translatte = require('translatte');
const fs = require('fs')
let CDs = [];
module.exports = {
    aliases: ['logs', `l`],
    description: 'logs search!',
    help: '`logs`',
    channelName: `spam`,
    execute: function (message, args) {
        search = args.join(' ')
        const logFiles = fs.readdirSync('./logs').filter(file => file.endsWith('.log'));
        for (let i = 0; i < logFiles.length; i++) {
            const fn = logFiles[i];
            f = fs.readFileSync(`./logs/${fn}`).toString()
            ls = f.split('\n')
            for (let j = 0; j < ls.length; j++) {
                const l = ls[j];
                if (l.includes(search)) {
                    message.channel.send(`\`\`\`
${ls[j-1]}
${ls[j]}\`\`\``)
                    return
                }
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