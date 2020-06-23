
module.exports = {
	aliases: ['invite'],
	description: 'Gives bot invite link',
	help: '`!invite`',
	execute:async function(message, args) {
        const { invite } = require('../config.json');
		message.channel.send(invite);
	},
};