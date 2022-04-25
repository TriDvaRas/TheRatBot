module.exports = {
    name: `A`,// sound name in logs
    triggers: [
        `aaa`,
        `ааа`
    ],// message parts which trigger the sound
    audio: `a.mp3`,
    volume: 0.5, // number or () => number
    duration:null, // null - full, [1500,4000] - random 1.5s-4s
    reply: null, // chat message
    customHandler:null, // (message) => void
}