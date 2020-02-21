
module.exports = {
	name: 'invite',
	description: 'Send invite link',
	execute(message, args) {
        const { invite } = require('../config.json');
		message.channel.send(invite);
	},
};