//Setup
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const logger = require("./logger");
//CommandList
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	logger.log('info', 'Connected to realm');
});

client.login(token);

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	//splitter
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	//CommandListCheck
	if (!client.commands.has(command)) return;
	//CommandExec
	try {
		if (args[0] == "help") {
			message.channel.send(`${client.commands.get(command).description}\nUsage:\n${client.commands.get(command).help}`)
		} else
			client.commands.get(command).execute(message, args);
	} catch (error) {
		logger.log('error', error);
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