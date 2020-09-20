const Discord = require("discord.js");
const serverUser = require("../../models/serverUser");
const {promptMessage} = require("../../utils/utils")

module.exports = {
  name: "massban",
  aliases: ["mban"],
  description: "Ban multiple people together using their ID/Mentions.",
  usage: "<User1>, <user2>, <user3>, and more....",
  example: "massban 668925478569656914, 736903852212748358",
  cooldown: 30,
  category: "Moderation",
  run: async(client, message, args) => {
    let users = [];
    if (message.deletable) message.delete();
        if (!args[0]) {
            return message.reply("Please provide a person to ban.")
                .then(m => m.delete({timeout: 10000}));
        }
        
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.reply("❌ You do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({timeout: 10000}));
        
        }
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({timeout: 10000}));
        }
        const toBan = args.join(" ").split(", ");

        /*if (!toBan) {
            return message.reply("Did you provide me the correct member ID/member mention? I dont think so! Please re-check.")
                .then(m => m.delete({timeout: 10000}));
        }*/
    
    const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            //.setAuthor(toBan.user.username, toBan.user.displayAvatarURL())
            .setDescription(`Are you sure you want to ban all of the ppl you provided IDs of?\n**This verification will become invalid in 30 seconds.**`)

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
              msg.delete();
                toBan.forEach(async(r) => {
          const u = message.guild.members.cache.get(r);
          if(!u) return message.reply(`User with ID \`${r}\` was not found.`);
          users.push("**"+u.displayName+"**");
          setTimeout(async() => {
            let user = await serverUser.findOne({
          userID: u.id,
          serverID: message.guild.id
        }).catch(e => console.log(e));
      if(!user) {
        const newserverUser = new serverUser({
          serverID: message.guild.id,
          userID: u.id,
          banCount: 1
        })
        await newserverUser.save().catch(e => console.log(e));
      }
          user.banCount += 1;
          u.ban();
          }, 1000)
        })
                  const embed = new Discord.MessageEmbed()
                  .setColor("#faf5cf")
                  .setTitle("Mass Ban Successfull! Banned:")
                  .setFooter(client.user.username, client.user.displayAvatarURL())
                  .setTimestamp()
                  .setDescription(users.join(" `|` "));
                  message.channel.send(embed)
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`The ban command was cancelled. Member was not banned.`)
                    .then(m => m.delete({timeout: 10000}));
            }
        });
  }
}