
module.exports = {
    aliases: ['наберем 15 лайков'],
    execute: async function (message, args) {
        message.reply(`Наберем!`);
        let emojis = client.emojis.cache.array().filter(e => e.guild.id == 272336653589413889);
        for (let i = 0; i < emojis.length; i++) {
            const emoji = emojis[i];
            message.react(emoji);
        }
    },
};