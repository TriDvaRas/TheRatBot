
module.exports = {
    aliases: ['да', `da`],
	spam: true,

    execute: async function (message, args) {
        message.channel.send(`пизда`).then(msg => msg.delete({ timeout: 60000 }));
    },
};