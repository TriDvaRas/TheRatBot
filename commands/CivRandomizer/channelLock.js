//imports
var FF = require('./FileFunctions.js');
var Perm = require('./PermissionsFunctions.js');
module.exports = {
    name: 'channelLock',
    description: 'Channel Lock',
    help: 'Admin only',
    execute:async function(message, args) {
        if (!Perm.checkRoles(message, "skip", true, false, false)) {
            message.reply("ахуел?(Admin only)");
            return;
        }
        cfg = FF.Read('./commands/CivRandomizer/config.json');
        if (args[0] == "add") {
            if (!channelIsWhite(message.channel, cfg)) {
                cfg.channelWhiteIds.push(`${message.channel.id}`);
                message.channel.send(`${message.author} whitelisted this channel`);
            }
        } else if (args[0] == "remove") {
            if (channelIsWhite(message.channel, cfg)) {
                RemoveItem(cfg.channelWhiteIds, `${message.channel.id}`);
                message.channel.send(`${message.author} blacklisted this channel`);
            }
        } else if (args[0] == "on") {
            if (!guildIsLocked(message.guild, cfg)) {
                cfg.channelLockGuildsIds.push(`${message.guild.id}`);
                message.channel.send(`${message.author} enabled channel lock on this server`);
            }
        } else if (args[0] == "off") {
            if (guildIsLocked(message.guild, cfg)) {
                RemoveItem(cfg.channelLockGuildsIds, `${message.guild.id}`);
                message.channel.send(`${message.author} disabled channel lock on this server`);
            }
        }





        FF.Write('./commands/CivRandomizer/config.json', cfg);

    },
};
function guildIsLocked(guild, cfg) {
    return cfg.channelLockGuildsIds.includes(`${guild.id}`);
}
function channelIsWhite(channel, cfg) {
    return cfg.channelWhiteIds.includes(`${channel.id}`);
}
function RemoveItem(array, item) {
    array.splice(array.indexOf(item), 1);
}