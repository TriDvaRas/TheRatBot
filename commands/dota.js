let Phrases = new Map(require(`../assets/DotaPhrases.json`))
let Heroes = require(`../assets/heroList.json`)
let { MessageEmbed } = require(`discord.js`)


module.exports = {
    aliases: [`d`, 'dota'],
    description: 'Dota hero responses',
    help: '`dota [hero_name] [phrase part]`\n`dota [hero_name] *`',
    execute: async function (message, args) {
        if (message.member.voice.channel) {
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
                    .setFooter(`${res.map(x=>x.text).join(`\n`)} `)
                )
                return
            }

            if (args.length > 1 && args[1] == `*`) {
                phr = hero.phrases[Math.floor(Math.random() * hero.phrases.length)]
            } else if (args.length > 1) {

                arg = args.slice(1).join(` `)
                phr = hero.phrases.find(p => p.text && p.text.toLowerCase().includes(arg.toLowerCase()))
                if (!phr)
                    return message.reply(`ТЫ! не, праВ (Что нахуй?)`)
            }
            else {
                phr = hero.phrases[0]
            }
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(phr.src, {
                volume: +phr.vol,
            });
            message.channel.send(new MessageEmbed()
                .setColor(`RED`)
                .setAuthor(`${heroName} `)
                .setDescription(`[All (${hero.count}) ${heroName} Responses](${hero.list})`)
                .setFooter(`${phr.text} `)
            )
            dispatcher.on('finish', () => {
                connection.disconnect();
                dispatcher.destroy();
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