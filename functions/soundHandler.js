const Discord = require('discord.js');
const fs = require(`fs`)
const logger = require("../logger");
module.exports = {
    sounds: [],
    init() {
        const cfgs = fs.readdirSync('./sounds').filter(file => file.endsWith('.js'));
        for (const file of cfgs) {
            const sound = require(`../sounds/${file}`);
            this.sounds.push(sound)
        }
    },
    async handle(message) {
        sound = this.sounds.find(x => x.triggers.find(t => message.content.toLowerCase().includes(t.toLowerCase())))
        if (sound) {
            if (message.guild.name == "Future Foundation" && message.channel.name != "spam") return;
            if (message.member.voice.channel) {
                if (sound.customHandler)
                    sound.customHandler(message)
                else {
                    const connection = await message.member.voice.channel.join();
                    logger.log('cmd', `${sound.name} in ${connection.channel.guild}/${connection.channel.name}`);
                    if (sound.reply)
                        message.channel.send(sound.reply)
                    const dispatcher = connection.play(`./assets/sounds/${sound.audio}`, {
                        volume: typeof sound.volume == 'function' ? sound.volume() : sound.volume
                    });
                    if (sound.duration)
                        setTimeout(() => {
                            dispatcher.pause()
                            connection.finishedAt = Date.now()
                        }, sound.duration[0] + (sound.duration[1] - sound.duration[0]) * Math.random())
                    //add connection to con list for auto close
                    globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
                    dispatcher.on('finish', () => { connection.finishedAt = Date.now() });
                }
            }
        }
    }
}