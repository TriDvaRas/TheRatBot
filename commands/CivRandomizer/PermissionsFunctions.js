
module.exports = {
    //check for permissions
    checkRoles(message, CurrState, checkAdmin, checkOp, checkCiv) {
        //botOwner
        const { roleName } = require('./config.json');
        if (`${message.author}` == "<@272084627794034688>") return true;
        if (checkAdmin && message.member.hasPermission('ADMINISTRATOR')) return true;
        if (checkOp && !(CurrState==="skip") && (CurrState.Op == message.author)) return true;
        if (checkCiv && message.member.roles.some(role => role.name === roleName)) return true;
        return false;
    }
}