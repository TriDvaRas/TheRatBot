module.exports = {
    name: `oof`, // sound name in logs
    triggers: [ 
        `уф`,
        `oof`
    ],// message parts which trigger the sound 
    audio: `oof.mp3`,
    volume: 1, // number or () => number
    duration: null, // null - full, [1500,4000] - random 1.5s-4s
    reply: null, // chat message
    customHandler:null, // (message) => void
}