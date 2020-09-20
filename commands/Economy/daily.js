const Discord = require("discord.js");
const User = require("../../models/user.js");
const ms = require("ms");

module.exports = {
  name: "daily",
  description: "Get your daily bonus.",
  category: "Economy",
  run: async(client, message, args) => {
    const embed = new Discord.MessageEmbed()
    .setTitle("Dailies!")
    .setThumbnail(message.author.avatarURL())
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp();
    
    User.findOne({
      userID: message.author.id
    }, async(err, user) => {
      if(err) console.log(err);
      let dailies = Math.floor(Math.random() * 3) + 1;
      if(!user) {
        const newUser = new User({
          userID: message.author.id,
          userName: message.author.username,
          coins: dailies,
          dailyCooldown: Date.now() + 1000*60*60*24
        })
        await newUser.save().catch(e => console.log(e));
        message.channel.send(embed.setDescription(`Yay! You have successfully claimed your daily bonus of **${dailies}** Discord coins!
You can collect your next daily bonus after **24 hours**!`).setColor("#cfafcf"));
      }
      if(user.dailyCooldown > Date.now()) return message.channel.send(embed.setDescription(`Uh oh! You are currently on cooldown for the daily command.
You can collect your next daily bonus after **${ms(user.dailyCooldown - Date.now(), {long: true})}**!`).setColor("RED"));
      if(user.dailyCooldown < Date.now()) {
        user.coins += dailies;
        await user.save().catch(e => console.log(e));
        message.channel.send(embed.setDescription(`Yay! You have successfully claimed your daily bonus of **${dailies}** Discord coins!
You can collect your next daily bonus after **24 hours**!`).setColor("#cfafcf"));
      }
    })
  }
}