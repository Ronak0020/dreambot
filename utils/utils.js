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
  static async promptMessage(message, author, time, validReactions) {
        time *= 1000;
        for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return message
           .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
  }
  
  static formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}
}