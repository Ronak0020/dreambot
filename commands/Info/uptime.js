const Discord = require("discord.js");

module.exports = {
  name: "uptime",
  category: "Info",
  description: "For how long is the bot online?",
  cooldown: 5,
  run: async(client, message, args) => {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 864000)
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    
    const embed = new Discord.MessageEmbed()
    .setTitle(client.user.username + "'s Uptime -")
    .setColor("#caf79d")
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(message.author.avatarURL())
    .setDescription(`Heya! I have been online for :
**${uptime}**`);
    message.channel.send(embed);
  }
}