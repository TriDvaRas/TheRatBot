var FF = require('./FileFunctions.js');
module.exports = {
    name: 'end',
    description: 'End phase',
    execute:async function(message, args) {
        //read state
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        var comm;
        switch (CurrState.Phase) {
            case "join":
                comm = require('./joinEnd.js');
                break;
            case "bans":
                comm = require('./bansSkip.js');
                break;
            default:
                break;
        }
        comm.execute(message, args);
    },
};