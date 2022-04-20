
const { MessageEmbed } = require("discord.js");
module.exports = {
	aliases: ['golos', `golosovanie`],
	description: 'golosovanie',
	help: '`golosovanie`',
	channelName: `spam`,
	execute,
};
let golosovanie = {
	yes: [],
	no: [],
	loopTimeout: null,
}
async function execute(message, args) {
	if (message.member.voice.channel) {
		golosovanie = {
			yes: [],
			no: [],
			loopTimeout: null,
		}
		let connection = await message.member.voice.channel.join();
		continueLoop(message, connection, true)
		let emb = new MessageEmbed()
			.setTitle(`${args[0] || `Голосование`}\u200B`)
			.setColor(`GREEN`)
			.addField(`🟢`, `\u200B`, true)
			.addField(`🔴`, `\u200B`, true)
		message.channel.send(emb).then(msg => {
			msg.react(`🟢`)
			msg.react(`🔴`)
			msg.react(`🛑`)
			const collector = msg.createReactionCollector((reaction, user) => [`🟢`, `🔴`, `🛑`].includes(reaction.emoji.name) && !user.bot);
			collector.on('collect', (reaction, user) => {
				reaction.users.remove(user);
				if (reaction.emoji.name === '🛑') {
					if (user.id == message.author.id) {
						clearTimeout(golosovanie.loopTimeout)
						collector.stop()
						const dispatcher = connection.play('./assets/golosovanie.mp3', {
							volume: 0.5,
							seek: 237
						});
						globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
						dispatcher.on('finish', () => {

							connection.finishedAt = Date.now()
						});
						golosovanie = {
							yes: [],
							no: [],
							loopTimeout: null,
						}
					}
					return
				}
				if (reaction.emoji.name === '🟢') {
					if (golosovanie.yes.includes(user))
						return
					golosovanie.yes.push(user)
					golosovanie.no = golosovanie.no.filter(x => x.id != user.id)
				}
				else if (reaction.emoji.name === '🔴') {
					if (golosovanie.no.includes(user))
						return
					golosovanie.no.push(user)
					golosovanie.yes = golosovanie.yes.filter(x => x.id != user.id)
				}
				emb.fields.find(x => x.name == `🟢`).value = `${golosovanie.yes.map(x => `${x}`).join(`\n`)}\u200B`
				emb.fields.find(x => x.name == `🔴`).value = `${golosovanie.no.map(x => `${x}`).join(`\n`)}\u200B`
				msg.edit(emb)
			});
			collector.on('end', (collected, reason) => {
				if (reason != `messageDelete`) {
					msg.reactions.removeAll();
				}
			});
		})
	}
	else{
		message.channel.send(`Надо быть в войсе, а то не по кайфу`)
	}
}
function continueLoop(message, connection, first) {
	const dispatcher = connection.play('./assets/golosovanie.mp3', {
		volume: 0.5,
		seek: first ? 0 : 10.5
	});
	globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
	dispatcher.on('start', () => {
		if (golosovanie.loopTimeout)
			clearTimeout(golosovanie.loopTimeout)
		golosovanie.loopTimeout = setTimeout(() => continueLoop(message, connection, false), first ? 167000 : 156600)
	});
	dispatcher.on('finish', () => {

		connection.finishedAt = Date.now()
	});
}