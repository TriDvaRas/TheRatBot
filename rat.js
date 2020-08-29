//Setup
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const blame = require(`./functions/autoBlame`);
const VH = require(`./functions/voiceHandler`);

globalThis.client = new Discord.Client();

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
	client.replies.each((reply, key) => {
		if (message.content.toLowerCase().includes(key)) {
			reply.execute(message);
		}
	})
	if (!message.content.startsWith(prefix)) {
		console.log(0);
		if (lastMsgs[0]?.content == message.content) {
			console.log(1);
			let reCount = lastMsgs.filter(msg => msg.content == message.content && msg.author != message.author).length
			lastMsgs.unshift({
				content: message.content,
				author: message.author.id
			})
			if (reCount >= 2) {
				console.log(2);
				message.channel.send(lastMsgs[0])
				lastMsgs = [];
			}

		}
		else {
			console.log(3);
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

		if (args[0] == "help") {
			message.channel.send(`${client.commands.get(command).description}\nUsage:\n${client.commands.get(command).help}`)
		} else
			client.commands.get(command).execute(message, args);
	} catch (error) {
		logger.log('error', "" + error);
		message.reply('Ты еблан?');
	}
});

client.on('voiceStateUpdate', (oldState, newState) => {
	VH.checkMuteDay(oldState, newState)
})






//logger
client.on('ready', () => {
	logger.log('info', 'Logged in');
	//autoblame
	if (!process.argv.includes(`test`))
		setTimeout(blame.blameRandom, (Math.random() + 0.5) * 8 * 3600000);
})
	.on('debug', m => logger.log('debug', `[*] ${m}`))
	.on('warn', m => logger.log('warn', `[*] ${m}`))
	.on('error', m => logger.log('error', `[*] ${m}`));

process
	.on('uncaughtException', error => {
		logger.log('error', `[*] ${error}`);
	})
	.on('unhandledRejection', error => {
		logger.log('error', `[*] ${error}`);
	})