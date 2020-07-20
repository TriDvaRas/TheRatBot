const IO = require(`../functions/IO`)
module.exports = {
	aliases: ['sub', 'subscribe'],
	description: 'Sub to PewDiePie!',
	help: 'subscribe',
	execute: function (message, args) {
		let arr = IO.Read(`./assets/subscribers.json`);
		if (!arr.includes(message.author.id)) {
			arr.push(message.author.id);
			IO.Write(`./assets/subscribers.json`, arr);
			message.reply(`Теперь я буду тебя ебать? Всю жизнь)`);

		}
		else
			message.reply(`Я уже тебя ебу? Всю жизнь)`);
	},
};