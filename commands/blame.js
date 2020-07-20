
const blame = require(`../functions/autoBlame`);

module.exports = {
    aliases: ['blame', `bl`, `b`],
    description: 'Blame me!',
    help: '`blame`',
    execute: function (message, args) {
        message.channel.send(`${message.author} ${blame.getNewBlame()}`)
    },
};