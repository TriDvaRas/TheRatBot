let osu = require(`../functions/osu`)
let fs = require('fs')
module.exports = {
	aliases: ['o', 'osu'],
	description: 'osu!',
	help: '`Bind account:\n`!o b <osu Username>`\nRecent scores:\n!o [args]`\nArgs:\n `.n` - номер скора в истории(начиная с последнего)\n `f` - показывать фейлы(не работает(пока?))\n `r` - подробные пипосы \nEx:\n `!o .2 r f`',
	spam: true,
	execute: async function (message, args) {
		if (args[0] == `b`) {
			if (!args[1])
				return message.channel.send(`Сука (ник где, еблан?)`)
			args.shift()
			osu.getV1User(args.join(` `)).then(user => {
				if (!user) return message.channel.send(`Сука (нет такого)`)
				let userStates = readUsers()
				let userState = userStates.find(x => x.discordId == message.author.id)
				if (userState) {
					userState.osuId = user.user_id
				}
				else {
					userStates.push({
						osuId: user.user_id,
						discordId: message.author.id,
						pp: +user.pp_raw,
						acc: +user.accuracy,
						rank: +user.pp_rank,
						rankReal: +user.pp_rank,
						playCount: +user.playcount,
					});
				}
				writeUsers(userStates)
				message.channel.send(`Привязал`)
			})
		}
		else {
			let userStates = readUsers()
			let userState = userStates.find(x => x.discordId == message.author.id)
			if (!userState)
				return message.channel.send(`Привяжи аккаунт быдло (\`!o b\`)`)
			let userId = userState.osuId
			let lim = 1
			let offArg = args.find(a => a.startsWith(`.`))
			let off = offArg ? +offArg.slice(1) > 1 ? +offArg.slice(1) - 1 : 0 : 0
			let fail = args.includes(`f`)
			let rich = args.includes(`r`)
			osu.getRecents(userId, { lim, off, fail }).then(scores => {
				osu.getV1Beatmap(scores[0].beatmap.id).then(beatmap => {
					osu.getPP(scores[0], beatmap).then(pp => {
						message.channel.send(osu.formatScore(scores[0], beatmap, pp, { rich }));
					})
				})
			})
		}

	},
};

function readUsers() {
	return JSON.parse(fs.readFileSync(`./assets/osuUsers.json`))
}

function writeUsers(users) {
	fs.writeFileSync(`./assets/osuUsers.json`, JSON.stringify(users))
}