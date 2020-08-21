
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
	aliases: ['aaa',`ааа`],
	execute,
};
async function execute(message, args) {
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
		logger.log('cmd',`A in ${connection.channel.guild}/${connection.channel.name}`);
		const dispatcher = connection.play('./assets/a.mp3', {
			volume: 0.5,
		});
		dispatcher.on('finish', () => {
			connection.disconnect();
			dispatcher.destroy();
		});
	}
}