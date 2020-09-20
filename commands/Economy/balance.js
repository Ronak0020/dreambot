const Discord = require("discord.js");
const User = require("../../models/user.js");

module.exports = {
  name: "balance",
  category: "Economy",
  cooldown: 5,
  aliases: ["bal"],
  description: "Check yours or another user's balance.",
  usage: "[@user]",
  example: "balance @Ronak",
  run: async(client, message, args) => {
    let member = message.mentions.users.first() || message.author;
    let coins = "0";
      const embed = new Discord.MessageEmbed()
      .setTitle("User Balance - " + member.username)
      .setColor("#fa78cf")
      .setThumbnail(member.displayAvatarURL())
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setTimestamp();
    User.findOne({
      userID: member.id
    }, async(err, user) => {
      if(err) console.log(err);
      if(!user) return message.channel.send(embed.setDescription(`**Discord Coins - ${coins}`));
      if(user) coins = user.coins;
      message.channel.send(embed.setDescription(`**Discord Coins -** ${coins}`));
    })
  }
}