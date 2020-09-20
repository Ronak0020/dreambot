const Discord = require("discord.js");

module.exports = {
  name: "list",
  aliases: ["glist"],
  category: "Giveaways",
  description: "Lists all the giveaways that are currently running in the server.",
  cooldown: 15,
  run: async(client, message, args) => {
    const currentGiveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended)
    let giveaways = [];
    if(currentGiveaways.length < 1) {
      giveaways.push("No ongoing giveaways in this server.")
    } else {
    for(i=0;i< currentGiveaways.length; i++) {
      giveaways.push(`${i + 1} - **${currentGiveaways[i].prize}** in ${message.guild.channels.cache.get(currentGiveaways[i].channelID)}`)
    }
    }
    const embed = new Discord.MessageEmbed()
    .setTitle("Ongoing giveaways in the current server:")
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setColor("#f78acf")
    .setDescription(giveaways.join("\n"));
    message.channel.send(embed);
  }
}