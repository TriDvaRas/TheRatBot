
module.exports = {
	aliases: ['die'],
	description: 'die',
	help: '`!die` to kill',
	execute,
};
async function execute(message, args) {
	if (message.member.voice.channel) {
		message.member.voice.channel.leave();
	}
    message.delete({timeout: 5000});
}