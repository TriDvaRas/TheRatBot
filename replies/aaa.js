
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
	aliases: ['aaa', `ааа`],
	execute,
	spam: true,
};
async function execute(message, args) {
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
		logger.log('cmd', `A in ${connection.channel.guild}/${connection.channel.name}`);
		const dispatcher = connection.play('./assets/a.mp3', {
			volume: 0.5,
		});
		globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
		dispatcher.on('finish', () => {
			connection.finishedAt = Date.now()
		});
	}
}