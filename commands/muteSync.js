
const Discord = require('discord.js');

module.exports = {
    aliases: ['mutesync', 'ms'],
    description: 'Bind your current channel server mute to your selfmute',
    help: '`hostaa`\n`hostaa -`',
	spam: true,
    execute: async function (message, args) {
        if (![`-`, `d`].includes(args[0])) {
            host = message.member
            channel = message.member.voice.channel
            //console.log(channel)
            message.channel.send(new Discord.MessageEmbed()
                .setTitle(`MuteSync Activated`)
                .setColor(`#A7DA1D`)
                .setDescription(`\`ms -\`/\`ms d\` to deactivate`)
                .addField(`Host`, `${host}`)
                .addField(`Channel`, `\`#${channel.name}\``)
                .setFooter(`Вам всем пизда!`)
            )
        }
        else {
            
            host = undefined
            channel = undefined
            mutedMembers.forEach(member => {
                    member.voice.setMute(false)
                    mutedMembers.delete(member.id)
            })
            message.channel.send(new Discord.MessageEmbed()
                .setColor(`#DA1D5B`)
                .setTitle(`MuteSync Deactivated`)
            )
        }
    },
    update: function (oldState, newState) {
        if (!host || !channel)
            return;
        if (newState.member.id != host.id || newState.channel.id != channel.id)
            return;

        channel = newState.channel
        if (newState.selfMute) {
            channel.members.each(member => {
                if (member.id != host.id) {
                    member.voice.setMute(true)
                    mutedMembers.set(member.id, member)
                }
            })
        }
        else {
            channel.members.each(member => {
                if (member.id != host.id) {
                    member.voice.setMute(false)
                    mutedMembers.delete(member.id)
                }
            })
        }
    }
};
let host
let channel
let mutedMembers = new Map()