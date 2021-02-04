let IO = require("../functions/IO")
let { getA } = require(`../functions/anecdotes`)
let Discord = require(`discord.js`)

module.exports = {
    aliases: ['amongass', 'aa', 'ass'],
    description: 'amongass!',
    help: '`amongass`',
    execute: function (message, args) {
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return;
        let isDMs = [];
        let isMSGs = [];
        let used = [];
        let failed = []
        let traits = IO.Read(`./assets/amongUsTraits.json`)
        voiceChannel.members.each(member => {
            let [pla, imp] = getTrait(false, args[0] == `r` ? [] : used, traits);
            used.push(pla);
            used.push(imp);
            isDMs.push(member.createDM().then(DM => {
                isMSGs.push(DM.send(`**Черта:**\n${pla}\n**+Если крыса:**\n${imp}`).then(() => { }, err => { failed.push(member.user.tag) }))
            }))
        })
        Promise.all(isDMs).then(res => {
            setTimeout(() => {
                Promise.all(isMSGs).then(res => {
                    setTimeout(() => {
                        message.channel.send(new Discord.MessageEmbed()
                            .setColor('#DC2121')
                            .setTitle("**Among Ass**")
                            .addFields(
                                { name: 'Player', value: `${voiceChannel.members.map(x => x.user).join(`\n`)}\u200B`, inline: true },
                                { name: 'Sucction?', value: `${voiceChannel.members.map(x => failed.includes(x.user.tag) ? `🔴` : `🟢`).join(`\n`)}\u200B`, inline: true },
                                { name: 'Extra Game Trait:', value: `${Math.random() < 0.1 ? `❗${traits.gameTraits[Math.floor(Math.random() * traits.gameTraits.length)]}❗` : `None`}\u200B`, inline: false }
                            )
                            .setTimestamp()
                        )
                    }, 30);
                });
            }, 30);
        });
    },
};

function getTrait(imposter, used, traits) {
    let pla = ""
    let imp = ""
    let i = 0
    do {
        i++
        pla = traits.playerTraits[Math.floor(Math.random() * traits.playerTraits.length)]
    } while (used.includes(pla) && i < 50);
    i = 0
    do {
        imp = traits.impostorTraits[Math.floor(Math.random() * traits.impostorTraits.length)]
    } while (used.includes(imp) && i < 50);

    if (pla.includes(`{anekdot}`)) {
        console.log(`!`);
        let a = getA()
        //console.log(a);
        pla = pla.replace(`{anekdot}`, `*${a}*`)
    }
    return [
        pla
            .replace(`{colorGo}`, colorsGo[Math.floor(Math.random() * colorsGo.length)])
            .replace(`{colorM}`, colorsM[Math.floor(Math.random() * colorsM.length)])
            .replace(`{n}`, 1 + Math.floor(Math.random() * colorsM.length)),
        imp
            .replace(`{colorGo}`, colorsGo[Math.floor(Math.random() * colorsGo.length)])
            .replace(`{colorM}`, colorsM[Math.floor(Math.random() * colorsM.length)])
            .replace(`{n}`, 1 + Math.floor(Math.random() * colorsM.length))
    ]

}


let colorsM = [
    "красным",
    "синим",
    "темно зеленым",
    "розовым",
    "оранжевым",
    "желтым",
    "черным",
    "белым",
    "фиолетовым",
    "коричневым",
    "голубым",
    "салатовым"
]
let colorsGo = [
    "красного",
    "синего",
    "темно зеленого",
    "розовог",
    "оранжевого",
    "желтого",
    "черного",
    "белого",
    "фиолетового",
    "коричневого",
    "голубого",
    "салатового"
]