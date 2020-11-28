
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
	aliases: ['oof', `уф`],
	execute,
};
async function execute(message, args) {
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
		logger.log('cmd', `oof in ${connection.channel.guild}/${connection.channel.name}`);
		const dispatcher = connection.play('./assets/oof.mp3', {
			volume: 1.0,
		});
		globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
		dispatcher.on('finish', () => {
			connection.finishedAt = Date.now()
		});
	}
}