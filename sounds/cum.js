module.exports = {
    name: `Cum`, // sound name in logs
    triggers: [ 
        `кам`,
        `ком`,
        `cum`,
        `come`,
    ],// message parts which trigger the sound 
    audio: `cumBoost.mp3`,
    volume: 0.7, // number or () => number
    duration: [900,6900], // null - full, [1500,4000] - random 1.5s-4s
    reply: `Cum? Ok. CUM`, // chat message
    customHandler:null, // (message) => void
}