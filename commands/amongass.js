module.exports = {
	aliases: ['amongass', 'aa', 'ass'], 
	description: 'amongass!',
	help:'`amongass`',
	execute: function(message, args) {
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return;
        let pros = [];
        voiceChannel.members.each(member=>{
            pros.push(member.createDM().then(DM=>{
                
                DM.send(getProp());
            }))
        })
        Promise.all(pros).then(()=>{message.channel.send('POOPA')},()=>{message.channel.send('LOOPA')});
	},
};