//Setup
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

//CommandList
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('Started!');
});

client.login(token);

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	//splitter
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	//CommandListCheck
	if (!client.commands.has(command)) return;
	//CommandEx
	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Ты еблан?');
	}
}); 