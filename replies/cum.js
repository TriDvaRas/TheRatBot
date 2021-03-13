
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
	aliases: [`cum`, `come`, `кам`,`ком`],
	spam: true,
	execute,
};
async function execute(message, args) {
	message.channel.send(`Cum? Ok. CUM`)
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
		logger.log('cmd', `cum in ${connection.channel.guild}/${connection.channel.name}`);
		const dispatcher = connection.play('./assets/cumBoost.mp3', {
			volume: 0.7,
		});
		setTimeout(()=>{
			dispatcher.pause()
			connection.finishedAt = Date.now()
		},2.500+6000*Math.random())
		globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
		dispatcher.on('finish', () => {
			connection.finishedAt = Date.now()
		});
	}
}