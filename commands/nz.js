
module.exports = {
	aliases: ['nz'],
	description: 'Нас здесь',
	help: '`Нас здесь`',
	execute: async function (message, args) {
		if (newState.member.id != `272084627794034688`)
			return;
		message.delete();
		global.nz = global.nz ? false : true
	},
};