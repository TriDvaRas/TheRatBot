
module.exports = {
    name: 'getRole',
    description: 'Get civ role',
    execute(message, args) {
        const { roleName } = require('./config.json');
        if (!message.member.roles.some(role => role.name === roleName)) {
            message.member.addRole(message.guild.roles.find(role => role.name === roleName));
            message.channel.send(`${message.author} got \`${roleName}\` role`);
        }else{
            message.channel.reply(`you already have a role`);
        }


    },
};