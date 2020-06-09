
module.exports = {
	name: 'a',
	description: 'AAAAAAAAAAA',
	help: '`!a`',
	execute,
};
async function execute(message, args) {
	message.channel.send("░░░░░▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░\n░░░▓▓▓▓▓▓▒▒▒▒▒▒▓▓░░░░░░░\n░░▓▓▓▓▒░░▒▒▓▓▒▒▓▓▓▓░░░░░\n░▓▓▓▓▒░░▓▓▓▒▄▓░▒▄▄▄▓░░░░\n▓▓▓▓▓▒░░▒▀▀▀▀▒░▄░▄▒▓▓░░░\n▓▓▓▓▓▒░░▒▒▒▒▒▓▒▀▒▀▒▓▒▓░░\n▓▓▓▓▓▒▒░░░▒▒▒░░▄▀▀▀▄▓▒▓░\n▓▓▓▓▓▓▒▒░░░▒▒▓▀▄▄▄▄▓▒▒▒▓\n░▓█▀▄▒▓▒▒░░░▒▒░░▀▀▀▒▒▒▒░\n░░▓█▒▒▄▒▒▒▒▒▒▒░░▒▒▒▒▒▒▓░\n░░░▓▓▓▓▒▒▒▒▒▒▒▒░░░▒▒▒▓▓░\n░░░░░▓▓▒░░▒▒▒▒▒▒▒▒▒▒▒▓▓░\n░░░░░░▓▒▒░░░░▒▒▒▒▒▒▒▓▓░░");
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
		console.log(`A in ${connection.channel.guild}/${connection.channel.name}`);
		const dispatcher = connection.play('./commands/assets/a.mp3', {
			volume: 0.5,
		});
		dispatcher.on('finish', () => {
			connection.disconnect();
			dispatcher.destroy();
		});
	}
}