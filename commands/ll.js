const fs = require("fs");
module.exports = {
    name: 'll',
    description: 'LoveLive',
    help: '`!ll` to die',
    execute,
};
async function execute(message, args) {
    message.delete({ timeout: 100 });
    if (message.author.id == 272091734429663237)
        return;
    let m = await message.channel.send({
        files: ['./commands/assets/ll.png']
    })
    m.delete({ timeout: 3000 });
    if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        console.log(`В ${connection.channel.guild}/${connection.channel.name} насрано`);

        const dispatcher = connection.play(getRandomPath(), {
            volume: 0.35,
            highWaterMark: 12,
        });
        dispatcher.on('finish', () => {
            connection.disconnect();
            dispatcher.destroy();
            console.log(`${connection.channel.guild}/${connection.channel.name}`);
        });
    }
}

function getRandomPath() {
    let { llPath } = require('../config.json');

    let Files = getFiles(llPath);
    if (!Files[0])
        return './commands/assets/sample.mp3';
    let id = Math.floor(Math.random() * Files.length);
    console.log(`Now Playing${id + 1}/${Files.length}`)
    let file = Files[id];
    console.log(file);
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
            name: file.replace(`.mp3`, ``).replace(`.flac`, ``)
        })
    });
    //add files from folders
    folderList.forEach(folder => {
        Files = Files.concat(getFiles(`${path}/${folder}`));
    });
    return Files;
}

