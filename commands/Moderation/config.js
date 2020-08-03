const Discord = require("discord.js");
const Server = require("../../models/server");
const options = ["setlevelredirect", "levelupmessage", "levelupmessagechannel", "levelupmessagemodule", "levelmodule" ,"setprefix", "setxp", "blacklistchannel", "blacklistcommand", "whitelistchannel", "whitelistcommand"];
const yes = ["yes", "on", "enable", "enabled"];
const no = ["no", "off", "disable", "disabled"];
const option2 = ["no", "off", "disable", "disabled", "yes", "on", "enable", "enabled"];
const util = require("../../utils/utils");
const levelplaceholder = ["`{memberMention}`", "`{memberUsername}`", "`{memberTag}`", "`{level}`", "`{currentXp}`"]
const Levels = require("../../utils/levels.js");

module.exports = {
    name: "configure",
    category: "Moderation",
    cooldown: 5,
    description: "Turn welcome, leave, boost module on/off",
    usage: "<option> <new value>",
    aliases: ["config", "configuration"],
    example: "config levelmodule off",
    run: async(client, message, args) => {
Server.findOne({
serverID: message.guild.id
}, async(err, server) => {
  if(!message.member.permissions.has(["ADMINISTRATOR"])) return message.reply("Only admins can use this command!");
  let user = await Levels.fetch(message.author.id, message.guild.id);
  let op = [];
  options.forEach(o => op.push(`\`${o}\``));
  const embed = new Discord.MessageEmbed()
  .setTitle("Configuration")
  .setColor("#fa67cf")
  .setFooter(client.user.username, client.user.displayAvatarURL())
  .setTimestamp()
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setThumbnail(message.guild.iconURL());
        if(!args[0]) return message.channel.send(embed.setDescription(`Welcome to **${client.user.username}'s** Configuration menu for __**${message.guild.name}**__ server!
To configure a feature, type \`${server.prefix}config <sub-option> <new value>\`
**List of available sub-options are :**
**${op.join(", ")}**`))
      
      switch(args[0]) {
        case "levelmodule":
          if(!option2.includes(args[1])) return message.channel.send(embed.setDescription(`Level Module is ${server.levelModule ? "**Enabled**" : "**Disabled**"}.
To change the setting, please use this command again but also provide the new value with it.`));
          if(yes.includes(args[1].toLowerCase())) {
              if(server.levelModule) return message.channel.send(embed.setDescription("Hmm... Why would someone turn on level module when it is already turned on?"));
            server.levelModule = true;
            await server.save().catch(e => console.log(e));
            message.channel.send(embed.setDescription(`Successfully **Enabled** Level Module for this server. Everyone will be able to earn xp now.`))
      } else if(no.includes(args[1].toLowerCase())) {
              if(!server.levelModule) return message.channel.send(embed.setDescription("Seems like the Level Module is already turned off. You can not turn something off if they are already off... Can you?"));
            server.levelModule = false;
            await server.save().catch(e => console.log(e));
        message.channel.send(embed.setDescription(`Successfully **Disabled** Level Module for this server. Now no one will earn any xp.`));
            }
          break;
        case "levelupmessage":
          if(!args.slice(1).length) return message.channel.send(embed.setDescription(`**Current level up message is :**
${util.replaceLevelMessage(server.levelUpMessage, message.author, user)}

To change this value, type the new value with the command.
**Available place holders are :**
${levelplaceholder.join(", ")}`));
          if(args[1]) {
            embed.addField("Previous Value :", util.replaceLevelMessage(server.levelUpMessage, message.author, user))
            server.levelUpMessage = args.slice(1).join(" ");
            await server.save().catch(e => console.log(e));
            return message.channel.send(embed.setDescription("Level Up Message has been successfully updated!").addField("New Value :", util.replaceLevelMessage(server.levelUpMessage, message.author, user)))
          }
      }
  });
}
}