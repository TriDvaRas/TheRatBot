const IO=require(`../functions/IO`)
module.exports = {
	aliases: ['sub', 'subscribe'],
	description: 'Sub to PewDiePie!',
	help:'subscribe',
	execute:function(message, args) {
        let arr = IO.Read(`./assets/subscribers.json`);
        arr.push(message.author.id);
        IO.Write(`./assets/subscribers.json`, arr);
        message.reply(`Теперь я буду тебя ебать? Всю жизнь)`);
	},
};