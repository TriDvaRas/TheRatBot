const numToStr = require(`../functions/numToStr`)

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
			mem = {
				id: message.author.id,
				cnt: message.member?.voice?.channel?.members?.size,
				oldName: message.member.nickname
			}
			global.NZmems.push(mem)
			message.reply(`+nz`)

			if (mem.cnt > 0)
				message.member.setNickname(getNZName(mem.cnt))
		}
	},
};

function getNZName(memCnt) {
	if (memCnt == 1)
		return `Я здесь один`
	else
		return `Нас здесь ${numToStr(memCnt)}`
}