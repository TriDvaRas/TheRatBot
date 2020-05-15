
module.exports = {
	name: 'popipa',
	description: 'Ping!',
	execute:async function(message, args) {
		message.channel.send('pipopa');
	},
};