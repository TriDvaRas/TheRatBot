const fs = require("fs");
const logger = require("../logger");
const chalk = require("chalk");
module.exports = {
    aliases: ['ll'],
    description: 'LoveLive',
    help: '`ll` to die',
	spam: true,
    execute,
};
async function execute(message, args) {
    message.delete({ timeout: 100 });
    if (message.author.id == 272091734429663237)
        return;
    let m = await message.channel.send({
        files: ['./assets/ll.png']
    })
    m.delete({ timeout: 3000 });
    if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        logger.log("cmd", `В ${connection.channel.guild}/${connection.channel.name} насрано`);

        const dispatcher = connection.play(getRandomPath(), {
            volume: 0.35,
            highWaterMark: 12,
        });
        globalThis.voiceConnections.set(message.guild.id, { connection, dispatcher })
        dispatcher.on('finish', () => {
            connection.finishedAt = Date.now()
        });
    }
}

function getRandomPath() {
    let { llPath } = require('../config.json');

    let Files = getFiles(llPath);
    if (!Files[0])
        return './assets/sample.mp3';
    let id = Math.floor(Math.random() * Files.length);
    logger.log("cmd", `Now Playing${id + 1}/${Files.length}`)
    let file = Files[id];
    logger.log("cmd", file);
    return file.path;
}

function getFiles(path) {
    let fileList = fs.readdirSync(path, { withFileTypes: true })
        .filter(dirent => !dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(file => file.endsWith(".mp3") || file.endsWith(".flac"));
    let folderList = fs.readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    let Files = [];
    //add files
    fileList.forEach(file => {
        Files.push({
            path: `${path}/${file}`,
            aliases: file.replace(`.mp3`, ``).replace(`.flac`, ``)
        })
    });
    //add files from folders
    folderList.forEach(folder => {
        Files = Files.concat(getFiles(`${path}/${folder}`));
    });
    return Files;
}

