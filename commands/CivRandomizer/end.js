var FF = require('./FileFunctions.js');
module.exports = {
    name: 'end',
    description: 'Ends current phase if possible (OP)',
    help: `\`!civ end\``,
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
        if(comm)
            comm.execute(message, args);
    },
};