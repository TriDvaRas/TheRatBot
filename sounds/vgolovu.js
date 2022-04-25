module.exports = {
    name: `vgolovu`, // sound name in logs
    triggers: [
        `в голову`, `вголову`, `v golovu`, `vgolovu`, `v golovy`, `vgolovy`, `headshot`
    ],// message parts which trigger the sound 
    audio: `vgolovu.mp3`,
    volume: 0.8, // number or () => number 
    duration: null, // null - full, [1500,4000] - random 1.5s-4s
    reply: null, // chat message
    customHandler: null, // (message) => void
}