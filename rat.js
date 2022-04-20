//Setup
const fs = require('fs');
const Discord = require('discord.js');
let { prefix, token } = require('./config.json');
const blame = require(`./functions/autoBlame`);
const VH = require(`./functions/voiceHandler`);
let { checkForNewScores } = require(`./functions/osu`)
const cron = require('node-cron');

if (process.argv.includes(`test`)) {
	token = process.env.RAT_DISCORD_KEY
	prefix = `\``
}
globalThis.client = new Discord.Client();
globalThis.voiceConnections = new Map()
global.nz = true
global.NZmems = []

setInterval(() => {
	globalThis.voiceConnections.forEach(({ connection, dispatcher }, key) => {
		if (connection.finishedAt && Date.now() - connection.finishedAt > 3600000) {
			connection.disconnect()
			dispatcher.destroy()
			globalThis.voiceConnections.delete(key)
		}
	})
}, 300000);

const logger = require("./logger");
const chalk = require("chalk");
//CommandList
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	for (let i = 0; i < command.aliases.length; i++)
		client.commands.set(command.aliases[i], command);


}

client.replies = new Discord.Collection();
const replyFiles = fs.readdirSync('./replies').filter(file => file.endsWith('.js'));
for (const file of replyFiles) {
	const command = require(`./replies/${file}`);
	for (let i = 0; i < command.aliases.length; i++)
		client.replies.set(command.aliases[i], command);

}

client.login(token);


let lastMsgs = [];
client.on('message', message => {
	if (message.author.bot) return;
	if (message.guild == null) return message.channel.send("пошел нахуй");

	client.replies.each((reply, key) => {
		if (message.content.toLowerCase().includes(key)) {
			if (reply.spam && message.guild.name == "Future Foundation" && message.channel.name != "spam") return;
			reply.execute(message);
		}
	})
	if (!message.content.startsWith(prefix)) {
		if (message.content == `<@!${client.user.id}>` || message.content == `<@${client.user.id}>`) {
			let blameStat = JSON.parse(fs.readFileSync(`./blameStats.json`))
			message.channel.send(new Discord.MessageEmbed()
				.setTitle(`КРЫСА(rat)`)
				.setColor('#46a832')
				.addField(`Server`, message.guild.name, false)
				.addField(`Prefix`, prefix, false)
				.addField(`Blames`, blameStat.users.reduce((accumulator, currentValue) => accumulator + currentValue.blames, 0), true)
				.addField(`Auto Blames`, blameStat.auto, true)
				.addField(`Subs`, getSubStat(), true)
				.addField(`**Main Blame Abuser**`, `${blameStat.users.reduce((prev, current) => (prev.blames > current.blames) ? prev : current).tag} (${blameStat.users.reduce((prev, current) => (prev.blames > current.blames) ? prev : current).blames})`, false)
				.addField(`BlameParts`, getPartsStat(), true)
				.setTimestamp()
				.setFooter('Я КРЫСА', 'https://tdr.s-ul.eu/hP8HuUCR')
			)
			return;
		}
		if (lastMsgs[0]?.content == message.content) {
			let reCount = lastMsgs.filter(msg => msg.content == message.content && msg.author != message.author).length
			lastMsgs.unshift({
				content: message.content,
				author: message.author.id
			})
			if (reCount >= 2) {
				message.channel.send(lastMsgs[0])
				lastMsgs = [];
			}

		}
		else {
			lastMsgs = [];
			lastMsgs.unshift({
				content: message.content,
				author: message.author.id
			})
		}
		return;
	}


	//splitter
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	//CommandListCheck
	if (!client.commands.has(command)) {

		return;
	}
	//CommandExec
	try {
		logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
		let cmd = client.commands.get(command)
		if (message.guild.name == "Future Foundation"
			&& cmd.channelName
			&& cmd.channelName != message.channel.name) return message.reply(`Тут нельзя срать иди нахуй`).then(m => m.delete({ timeout: 5000 }).then(()=>message.delete()));
		if (args[0] == "help") {
			message.channel.send(`${cmd.description}\nUsage:\n${cmd.help}`)
		} else
			cmd.execute(message, args);
	} catch (error) {
		logger.log('error', "" + error);
		message.reply('Ты еблан?');
	}
});

client.on('voiceStateUpdate', (oldState, newState) => {
	VH.checkMuteDay(oldState, newState)
	VH.checkMuteAll(oldState, newState)
	VH.checkNZ(oldState, newState)
})

function getPartsStat() {
	let parts = JSON.parse(fs.readFileSync(`./assets/phraseParts.json`));
	return `Prefix: ${parts.prefix.length}\nFirst: ${parts.first.length}\nSecond: ${parts.second.length}\nThird: ${parts.third.length}\nAva: ${parts.ava.length}\nGames: ${Games.length}`
}

function getSubStat() {
	let subs = JSON.parse(fs.readFileSync(`./assets/subscribers.json`));
	return subs.length;
}
//logger
client.on('ready', () => {
	logger.log('info', `Logged in as ${client.user.tag}`);
	//autoblame
	// if (!process.argv.includes(`test`))
	// 	 setTimeout(blame.blameRandom, (Math.random() + 0.5) * 3 * 3600000);

	cron.schedule('*/30 * * * * *', () => {
		//checkForNewScores()
	})
})
	.on('debug', m => logger.log('debug', `[*] ${m}`))
	.on('warn', m => logger.log('warn', `[*] ${m}`))
	.on('error', m => logger.log('error', `[*] ${m}`));

process
	.on('uncaughtException', error => {
		logger.log('error', `[*] ${error}`);
		console.log(`[*] ${error}`);
	})
	.on('unhandledRejection', error => {
		logger.log('error', `[*] ${error}`);
		console.log(`[*] ${error}`);
	})
