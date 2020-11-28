
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
	aliases: ['в голову', `вголову`, `v golovu`, `vgolovu`, `v golovy`, `vgolovy`],
	execute,
};
async function execute(message, args) {
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
		logger.log('cmd', `vgolovu in ${connection.channel.guild}/${connection.channel.name}`);
		const dispatcher = connection.play('./assets/vgolovu.mp3', {
			volume: 0.8,
		});
		globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
		dispatcher.on('finish', () => {
			connection.finishedAt = Date.now()
		});
	}
}