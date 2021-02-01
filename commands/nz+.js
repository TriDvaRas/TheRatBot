
module.exports = {
	aliases: ['nz+'],
	description: 'Нас здесь',
	help: '`Нас здесь`',
	execute: async function (message, args) {
		if (message.member.id != `272084627794034688`)
			return;
		message.delete();
		global.nz = global.nz ? false : true
		message.reply(global.nz ? `+NZ` : `-NZ`).then(msg => msg.delete({ timeout: 2500 }))
		for (const mem of global.NZmems) {
			let host = message.guild.members.cache.get(`${mem.id}`)
			
			host.setNickname(mem.oldName)
			global.NZmems.splice(global.NZmems.indexOf(mem), 1)
		}
	},
};