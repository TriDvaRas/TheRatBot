let Phrases = new Map(require(`../assets/DotaPhrases.json`))
let Heroes = require(`../assets/heroList.json`)
let { MessageEmbed } = require(`discord.js`)


module.exports = {
    aliases: [`d`, 'dota'],
    description: 'Dota hero responses',
    help: '`dota [hero_name] [phrase part]`\n`dota [hero_name] *` \n`dota * *`',
    execute: async function (message, args) {
        if (message.member.voice.channel) {
            let heroName
            if (args[0] == `*`)
                heroName = Heroes[Math.floor(Math.random() * Heroes.length)]
            else
                heroName = Heroes.find(x => x.toLowerCase().startsWith(args[0].toLowerCase()) || replaceAll(x.toLowerCase(), ` `, `_`) == args[0].toLowerCase())
            if (!heroName)
                return message.reply(`ТЫ! не, праВ (Кто нахуй?)`)
            hero = Phrases.get(heroName.toLowerCase())

            if (args.length > 1 && args[1].startsWith(`?`)) {
                arg = args.slice(1).join(` `).slice(1)
                res = hero.phrases.filter(p => p.text && p.text.toLowerCase().includes(arg.toLowerCase()))
                message.channel.send(new MessageEmbed()
                    .setColor(`#56E54A`)
                    .setAuthor(`Search results `)
                    .setDescription(`${heroName}`)
                    .setFooter(`${res.map(x => x.text).join(`\n`)} `)
                )
                return
            }

            if (args.length > 1 && args[1] == `*`) {
                phr = hero.phrases[Math.floor(Math.random() * hero.phrases.length)]
            } else if (args.length > 1) {
                arg = args.slice(1).join(` `)
                phr = hero.phrases.filter(p => p.text && p.text.toLowerCase().includes(arg.toLowerCase()))
                phr= phr[Math.floor(Math.random() * phr.length)]
                
                if (!phr)
                    return message.reply(`ТЫ! не, праВ (Что нахуй?)`)
            }
            else {
                phr = hero.phrases[0]
            }
            let connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(phr.src, {
                volume: +phr.vol,
            });

            message.channel.send(new MessageEmbed()
                .setColor(`RED`)
                .setAuthor(`${heroName} `)
                .setDescription(`[All ${hero.count} ${heroName} EN Responses](${hero.list}) ${hero.rucount ? `\n[All ${hero.rucount} ${heroName} RU Responses](${hero.rulist})` : ``}`)
                .setFooter(`${phr.text} `)
            )
            globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
            dispatcher.on('finish', () => {
                connection.finishedAt = Date.now()
            });
        }
    },
};


function replaceAll(str, a, b) {
    while (str.includes(a)) {
        str = str.replace(a, b)
    }
    return str
}