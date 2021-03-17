
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
	aliases: [`pelmeni`, `пельмени`],
	spam: true,
	execute,
};
async function execute(message, args) {
	message.channel.send(`Пельмени. Хорошие пельмени это очень вкусно. На самом деле рецепт простой - много мяса, мало теста. Сперва готовим тонкое яичное тесто, с добавлением сливочного масла. Лук сладких сортов для образования бульончика и перец совсем немного. Щедро выкладываем великолепный рубленый фарш, много мяса, мало теста. Вот он настоящий пельмень, а внутри много сочной начинки, грудинка индюшки с курицей или телятина со свининой. Многие и забыли как это может быть вкусно. Выбирайте и наслаждайтесь. Много мяса, мало теста.`)
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
		logger.log('cmd', `cum in ${connection.channel.guild}/${connection.channel.name}`);
		const dispatcher = connection.play('./assets/pelmeni.mp3', {
			volume: Math.random() < 0.05 ? 1 : 0.3,
		});
		globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
		dispatcher.on('finish', () => {
			connection.finishedAt = Date.now()
		});
	}
}