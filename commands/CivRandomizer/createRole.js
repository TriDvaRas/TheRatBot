
var Perm = require('./PermissionsFunctions.js');
module.exports = {
    name: 'createRole',
    description: 'Get civ role',
    help: 'Admin only',
    execute:async function(message, args) {
        if (!Perm.checkRoles(message, "skip", true, false, false)) {
            message.reply("ахуел?(Admin only)");
            return;
        }
        const { roleName } = require('./config.json');
        if (!message.guild.roles.find(role => role.name === roleName)) {
            message.guild.createRole({
                name: roleName,
                mentionable: true,
                color: [64, 255, 159]
            });
            message.channel.send(`${message.author} created CivRole`);
        } else {
            message.reply(`role already exists`);
        }


    },
};