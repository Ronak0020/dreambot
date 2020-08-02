const Discord = require('discord.js');
const Levels = require('../../utils/levels');

module.exports = {
    name: 'rank',
    category: 'Levels',
    description: "Check your server level.",
    aliases: ["level"],
    usage: "[@user]",
    example: "rank @Ronak#7611",
    cooldown: 5,
    run: async(client, message, args) => {
        const target = message.mentions.users.first() || message.author;
 
        const user = await Levels.fetch(target.id, message.guild.id);
        
        if (!user) return message.channel.send("Hmm... Seems like this user is inactive. They have not earned any xp. No details to show...");
        
        const rawLeaderboard = await Levels.rawLeaderboard(message.guild.id, message.guild.members.cache.size);
      const pos = rawLeaderboard.findIndex(i => i.guildID === message.guild.id && i.userID === target.id) + 1;
        
        const embed = new Discord.MessageEmbed()
        .setTitle(`Rank - ${target.username}`, target.displayAvatarURL())
        .setDescription(`**Level -** ${user.level}\n**XP -** ${user.xp}\n**Server Rank -** #${pos}`)
        .setColor('#d6cf7a')
        .setThumbnail(target.displayAvatarURL())
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp()
        message.channel.send(embed);
    }
}