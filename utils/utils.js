module.exports = class Util {
    static getMember(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target) 
            target = message.member;
            
        return target;
    }
    static removeDuplicates(arr) {
		return [...new Set(arr)];
    }
    static replaceLevelMessage(msg, user, level) {
        return msg
        .replace(/{memberMention}/gi, "<@" + user.id + ">")
        .replace(/{memberUsername}/gi, user.username)
        .replace(/{memberTag}/gi, user.tag)
        .replace(/{level}/gi, level.level)
        .replace(/{currentXp}/gi, level.xp)
    }
}