
module.exports = {
    aliases: ['пизда',`pizda`],
	spam: true,
    execute: async function (message, args) {
        message.channel.send(`да`).then(msg => msg.delete({ timeout: 60000 }));;
    },
};