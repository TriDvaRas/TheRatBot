const { indexOf } = require("ffmpeg-static");

module.exports = {
    aliases: ['лайков', `likes`],
    execute: async function (message, args) {
        let msg = message.content.split(/ +/);
        let aliasIndex = msg.indexOf(`лайков`);
        if (aliasIndex == -1)
            aliasIndex = msg.indexOf(`likes`);
        n = parseInt(msg[aliasIndex - 1]);
        if (n > 0) {
            let emojis = client.emojis.cache.array().filter(e => e.guild.id == 272336653589413889);
            for (let i = 0; i < n && i < emojis.length; i++) {
                const emoji = emojis[i];
                message.react(emoji);
            }

        }
    },
};

