
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
	aliases: ['a'],
	description: 'AAAAAAAAAAA',
	help: '`a`',
	channelName: `spam`,
	execute,
};
async function execute(message, args) {
	message.channel.send("░░░░░▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░\n░░░▓▓▓▓▓▓▒▒▒▒▒▒▓▓░░░░░░░\n░░▓▓▓▓▒░░▒▒▓▓▒▒▓▓▓▓░░░░░\n░▓▓▓▓▒░░▓▓▓▒▄▓░▒▄▄▄▓░░░░\n▓▓▓▓▓▒░░▒▀▀▀▀▒░▄░▄▒▓▓░░░\n▓▓▓▓▓▒░░▒▒▒▒▒▓▒▀▒▀▒▓▒▓░░\n▓▓▓▓▓▒▒░░░▒▒▒░░▄▀▀▀▄▓▒▓░\n▓▓▓▓▓▓▒▒░░░▒▒▓▀▄▄▄▄▓▒▒▒▓\n░▓█▀▄▒▓▒▒░░░▒▒░░▀▀▀▒▒▒▒░\n░░▓█▒▒▄▒▒▒▒▒▒▒░░▒▒▒▒▒▒▓░\n░░░▓▓▓▓▒▒▒▒▒▒▒▒░░░▒▒▒▓▓░\n░░░░░▓▓▒░░▒▒▒▒▒▒▒▒▒▒▒▓▓░\n░░░░░░▓▒▒░░░░▒▒▒▒▒▒▒▓▓░░");
	if (message.member.voice.channel) {
		let connection = await message.member.voice.channel.join();
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