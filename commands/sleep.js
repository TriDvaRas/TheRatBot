
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
	aliases: [`sl'`,`sleep`],
	description: 'sleep',
	help: '`sleep`',
	execute,
};
async function execute(message, args) {
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
		logger.log('cmd',`S in ${connection.channel.guild}/${connection.channel.name}`);
		const dispatcher = connection.play('./assets/s.mp3', {
			volume: 0.5,
		});
		dispatcher.on('finish', () => {
			logger.log('cmd',`Finished S in ${connection.channel.guild}/${connection.channel.name}`);
			connection.disconnect();
			dispatcher.destroy();
		});
	}
}