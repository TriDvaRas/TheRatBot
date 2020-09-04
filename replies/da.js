
module.exports = {
    aliases: ['да', `da`],
    execute: async function (message, args) {
        message.channel.send(`пизда`).then(msg => msg.delete({ timeout: 60000 }));
    },
};