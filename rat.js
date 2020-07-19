//Setup
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const blame = require(`./functions/autoBlame`);

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

client.on('message', message => {
	if (message.author.bot) return;
	client.replies.each((value, key)=>{
		if (message.content.includes(key)){
			value.execute(message);
		}
	})
	if (!message.content.startsWith(prefix)) return;
	//splitter
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	//CommandListCheck
	if (!client.commands.has(command)) return;
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

client.on('voiceStateUpdate', (oldMember, newMember) => {
	if (newMember.id != 272091734429663237)//272091734429663237
		return;
	if (newMember.channelID != null) {
		let voiceCons = client.voice.connections.array();
		let con = voiceCons.find(x => x.channel.id == newMember.channelID);
		if (con) {
			if (con.dispatcher)
				con.dispatcher.destroy();
			logger.log('warn', "Шухер");
		}
	}
})






//logger
client.on('ready', () => {
	logger.log('info', 'Logged in')
	blame();
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