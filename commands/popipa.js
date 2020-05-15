
module.exports = {
	name: 'popipa',
	description: 'Popipa!',
	help:'`!popipa`',
	execute:async function(message, args) {
		message.channel.send('pipopa');
	},
};