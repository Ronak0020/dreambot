const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const serverUser = require("../../models/serverUser");
const { promptMessage } = require("../../utils/utils.js");

module.exports = {
    name: "kick",
    category: "Moderation",
    description: "Kick a member from the server",
    usage: "<id | mention> [reason]",
    example: "kick @Ronak warned you before!",
    cooldown: 10,
    run: async (client, message, args) => {
        const logChannel = message.channel;

        if (message.deletable) message.delete();
        if (!args[0]) {
            return message.reply("Please provide a person to kick.")
                .then(m => m.delete({timeout: 10000}));
        }
        var reason = args.slice(1).join(" ");
        if (!reason) reason = "No reason provided.";
        if (!message.member.permissions.has("KICK_MEMBERS")) {
            return message.reply("❌ You do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete({timeout: 10000}));
        
        }
        if (!message.guild.me.permissions.has("KICK_MEMBERS")) {
            return message.reply("❌ I do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete({timeout: 10000}));
        }

        const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!toBan) {
            return message.reply("Did you provide me the correct member ID/member mention? I dont think so! Please re-check.")
                .then(m => m.delete({timeout: 10000}));
        }

        if (toBan.id === message.author.id) {
            return message.reply("I won't allow you to kick yourself!")
                .then(m => m.delete(15000));
        }
        if(toBan.permissions.has(["ADMINISTRATOR"])) return message.reply("You can not kick an Admin.").then(m => m.delete({timeout: 10000}));
        if (!toBan.kickable) {
            return message.reply("I can't kick that person due to either my role is not high enough or the member is an Admin.")
                .then(m => m.delete({timeout: 10000}));
        }
        let user = await serverUser.findOne({
          userID: toBan.id,
          serverID: message.guild.id
        }).catch(e => console.log(e));
      if(!user) {
        const newserverUser = new serverUser({
          serverID: message.guild.id,
          userID: toBan.id,
          kickCount: 1
        })
        await newserverUser.save().catch(e => console.log(e));
      }
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**- kicked member:** ${toBan} (${toBan.id})
            **- kicked by:** ${message.member} (${message.member.id})
            **- Reason:** ${reason}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setAuthor(toBan.user.username, toBan.user.displayAvatarURL())
            .setDescription(`Are you sure you want to kick ${toBan}?\n**This verification will become invalid in 30 seconds.**`)

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();
                     toBan.createDM()
                     .then((DMChannel) => {
                     	DMChannel.send(`You were kicked from server __${message.guild.name}__ \n *REASON :-*\n **${reason}**`)
                     	.then(() => {
                     		toBan.kick(reason);
                        user.kickCount += 1;
                        user.save().catch(e => console.log(e));
                         })
                        })

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`The kick command was cancelled. Member was not kicked.`)
                    .then(m => m.delete({timeout: 10000}));
            }
        });
    }
};
