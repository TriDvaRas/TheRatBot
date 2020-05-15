
//Setup
const fs = require('fs');
const config = require('./CivRandomizer/config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const FF = require('./CivRandomizer/FileFunctions.js');
//CommandList
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/CivRandomizer').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    if (!file.includes('Functions')) {
        const command = require(`./CivRandomizer/${file}`);
        client.commands.set(command.name, command);
    }
}
//console.log(client.commands);

module.exports = {
    name: 'civ',
    description: 'CivRandomizer',
    help: '`!civ start`\n`!civ reset`\n`!civ list`',
    execute:async function(message, args) {
        //channel lock check
        cfg = FF.Read('./commands/CivRandomizer/config.json');
        if (!cfg.WhiteCommands.includes(args[0]))
            if (cfg.channelLockGuildsIds.find(x => (x == `${message.guild.id}`)))
                if (!(cfg.channelWhiteIds.find(x => (x == `${message.channel.id}`))))
                    return;

        //args check
        if (args.length > 0) {
            //split args
            command = args[0];
            args.shift();
            if (!client.commands.has(command)) return;
            //CommandEx
            try {
                if (config.deleteCommands)
                    client.commands.get(command).execute(message, args);
                message.delete(5000);

            } catch (error) {
                console.error(error);
                message.reply('Ты еблан??');
            }
            return;
        }
        message.channel.send(this.help);
    },
};