
module.exports = {
	aliases: ['nz'],
	description: 'Нас здесь',
	help: '`Нас здесь`',
	execute: async function (message, args) {
		let mem = global.NZmems.find(x => x.id == message.author.id)
		if (mem) {
			message.member.setNickname(mem.oldName)
			global.NZmems.splice(global.NZmems.indexOf(mem), 1)
			message.reply(`-nz`)
		}
		else {
			global.NZmems.push({
				id: message.author.id,
				cnt: message.member?.voice?.channel?.members?.size,
				oldName: message.member.nickname
			})
			message.reply(`+nz`)
		}
	},
};