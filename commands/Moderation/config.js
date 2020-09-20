const Discord = require("discord.js");
const Server = require("../../models/server");
const options = ["levelupmessageredirect", "levelupmessage", "levelupmessagechannel", "levelupmessagemodule", "levelmodule" ,"setprefix", "setxp", "blacklistchannel", "blacklistcommand", "whitelistchannel", "whitelistcommand", "antialt", "antialtage"];
const yes = ["yes", "on", "enable", "enabled"];
const no = ["no", "off", "disable", "disabled"];
const option2 = ["no", "off", "disable", "disabled", "yes", "on", "enable", "enabled"];
const util = require("../../utils/utils");
const levelplaceholder = ["`{memberMention}`", "`{memberUsername}`", "`{memberTag}`", "`{level}`", "`{currentXp}`"]
const Levels = require("../../utils/levels.js");
const ms = require("ms");

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
          break;
        case "levelupmessagemodule":
          if(!args[1]) return message.channel.send(embed.setDescription(`**Current level up message module is :**
${server.levelUpMessageModule ? "**Enabled**" : "**Disabled**"}

To change this value, type the new value with the command (yes/no, enable/disable, on/off).
**For Example :** \`${server.prefix}config levelupmessagemodule off\``));
          if(args[1]) {
            embed.addField("Previous Value :", server.levelUpMessageModule ? "**Enabled**" : "**Disabled**", true)
            if(yes.includes(args[1].toLowerCase())) {
              if(server.levelUpMessageModule) return message.channel.send(embed.setDescription("Hmm... Why would someone turn on something which is already turned on?"));
            server.levelUpMessageModule = true;
            await server.save().catch(e => console.log(e));
      } else if(no.includes(args[1].toLowerCase())) {
              if(!server.levelModule) return message.channel.send(embed.setDescription("Seems like the Level Up Messages are already turned off. You can not turn something off if they are already off... Can you?"));
            server.levelUpMessageModule = false;
            await server.save().catch(e => console.log(e));
            }
            return message.channel.send(embed.setDescription("Level Up Message Module has been successfully updated!").addField("New Value :", `${server.levelUpMessageModule ? "**Enabled**" : "**Disabled**"}`, true))
          }
          break;
        case "levelupmessageredirect":
          if(!args[1]) return message.channel.send(embed.setDescription(`**Current level up message redirection is :**
${server.levelUpMessageRedirect ? "**Enabled**" : "**Disabled**"}

To change this value, type the new value with the command (yes/no, enable/disable, on/off).
**For Example :** \`${server.prefix}config levelupmessageredirect off\``));
          if(args[1]) {
            embed.addField("Previous Value :", server.levelUpMessageRedirect ? "**Enabled**" : "**Disabled**", true)
            if(yes.includes(args[1].toLowerCase())) {
              if(server.levelUpMessageRedirect) return message.channel.send(embed.setDescription("Hmm... Why would someone turn on something which is already turned on?"));
            server.levelUpMessageRedirect = true;
            await server.save().catch(e => console.log(e));
      } else if(no.includes(args[1].toLowerCase())) {
              if(!server.levelModule) return message.channel.send(embed.setDescription("Seems like the Level Up Messages redirection is already turned off. You can not turn something off if they are already off... Can you?"));
            server.levelUpMessageRedirect = false;
            await server.save().catch(e => console.log(e));
            }
            return message.channel.send(embed.setDescription("Level Up Message Redirection setting has been successfully updated!\nPlease make sure to add a redirection channel for the messages to show else bot will be crashed. Use `config levelupmessagechannel #channel` command to set a channel.").addField("New Value :", `${server.levelUpMessageRedirect ? "**Enabled**" : "**Disabled**"}`, true))
          }
          break;
        case "levelupmessagechannel":
          let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
          if(!channel) return message.reply("Oopsie! I can not find that channel! Please re-check my permissions or ID of the channel (if you provided ID)");
          if(!args[1]) return message.channel.send(embed.setDescription(`**Current level up message channel is set to :**
${server.levelUpMessageChannel}

To change this value, type the new value with the command.
**For Example :** \`${server.prefix}config levelupmessagechannel #level-ups\``));
          if(channel) {
            embed.addField("Previous Value :", "<#"+server.levelUpMessageChannel+">", true)
            server.levelUpMessageChannel = channel.id;
            server.levelUpMessageRedirect = true;
            await server.save().catch(e => console.log(e));
            return message.channel.send(embed.setDescription("Level Up Message Channel has been successfully updated!").addField("New Value :", channel, true))
          }
          break;
        case "setxp":
          let xp = parseInt(args[1]);
          if(!args[1] || isNaN(args[1])) return message.channel.send(embed.setDescription(`**Current XP gain/message is set to :**
${server.earnXp}

To change this value, type the new value with the command.
**For Example :** \`${server.prefix}config setxp 30\``));
          if(xp) {
            if(xp > 100) return message.reply("Uhh... I guess it will be no fun making xp gain/message that high. Enter a value below 100 please.");
            embed.addField("Previous Value :", server.earnXp, true)
            server.earnXp = xp;
            await server.save().catch(e => console.log(e));
            return message.channel.send(embed.setDescription("Xp gain/message has been successfully updated!").addField("New Value :", xp, true))
          }
          break;
        case "setprefix":
          let prefix = args[1];
          if(!args[1]) return message.channel.send(embed.setDescription(`**Current prefix for this server is :**
${server.prefix}

To change this value, type the new value with the command.
**For Example :** \`${server.prefix}config setprefix ?\``));
          if(prefix) {
            if(prefix.length > 4) return message.reply("Uhh... Isn't that too big prefix for a bot? Try something shorter.");
            embed.addField("Previous Value :", server.prefix, true)
            server.prefix = prefix;
            await server.save().catch(e => console.log(e));
            return message.channel.send(embed.setDescription("Prefix has been successfully updated!").addField("New Value :", prefix, true))
          }
          break;
          case "blacklistcommand":
          let bcmd = server.blacklistedCommands.join("\n");
          if(server.blacklistedCommands.length < 1) bcmd = "No commands have been blacklisted in this server.";
          if(!args[1]) return message.channel.send(embed.setDescription(`**Current list of commands blacklisted in this server is :**
\`${bcmd}\`

To blacklist a command, provide the command name with this command.
**For Example :** \`${server.prefix}config blacklistcommand meme\``));
          if(args[1]) {
            let command = client.commands.get(args[1]);
      if (!command) command = client.commands.get(client.aliases.get(args[1]));
            if(!command) return message.reply("Uhh... Seems like i do not even have that command. Why blacklisting something that i don't even have?");
            if(server.blacklistedCommands.includes(command.name)) return message.reply("Uhh... That command seems to be blacklisted already.");
            server.blacklistedCommands.push(command.name);
            await server.save().catch(e => console.log(e));
            return message.channel.send(embed.setDescription("Command has been successfully blacklisted! No one can use that command in this server now!"))
          }
          break;
          case "blacklistchannel":
          let bchn = server.blacklistedChannels.join("\n");
          if(server.blacklistedChannels.length < 1) bchn = "No channels have been blacklisted in this server.";
          if(!args[1]) return message.channel.send(embed.setDescription(`**Current list of channels blacklisted in this server is :**
\`${bchn}\`

To blacklist a channel, provide the channel mention/id name with this command. If a channel is blacklisted, no one will gain any xp in that channel.
**For Example :** \`${server.prefix}config blacklistchannel #meme\``));
          if(args[1]) {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if(!channel) return message.reply("Uhh... Seems like that channel doesn't exists. Please re-check the details u provided.");
            if(server.blacklistedChannels.includes(channel.id)) return message.reply("Uhh... That channel seems to be blacklisted already.");
            server.blacklistedChannels.push(channel.id);
            await server.save().catch(e => console.log(e));
            return message.channel.send(embed.setDescription("Channel has been successfully blacklisted! No one will gain any xp in that channel now!"))
          }
          break;
        case "whitelistchannel":
           let bchn2 = server.blacklistedChannels.join("\n");
          if(server.blacklistedChannels.length < 1) bchn2 = "No channels have been blacklisted in this server.";
          if(!args[1]) return message.channel.send(embed.setDescription(`**Current ID list of channels blacklisted in this server is :**
\`${bchn2}\`

To whitelist a channel, provide the channel mention/id with this command. If a channel is whitelisted, everyone will gain xp in that channel.
**For Example :** \`${server.prefix}config whitelistchannel #meme\``));
          if(args[1]) {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if(!server.blacklistedChannels.includes(channel.id)) return message.reply("Uhh... That channel is not blacklisted I suppose.");
            let index = server.blacklistedChannels.indexOf(channel.id);
            server.blacklistedChannels.splice(index, 1);
            await server.save().catch(e => console.log(e));
            return message.channel.send(embed.setDescription("Channel has been successfully whitelisted! Everyone will gain xp in that channel now!"))
          }
          break;
          case "whitelistcommand":
           let bcmd2 = server.blacklistedCommands.join("\n");
          if(server.blacklistedCommands.length < 1) bcmd2 = "No commands have been blacklisted in this server.";
          if(!args[1]) return message.channel.send(embed.setDescription(`**Current list of commands blacklisted in this server is :**
\`${bcmd2}\`

To whitelist a command, provide the command name with this command. If a command is whitelisted, everyone will be able to use it.
**For Example :** \`${server.prefix}config whitelistcommand meme\``));
          if(args[1]) {
            let command = client.commands.get(args[1]);
      if (!command) command = client.commands.get(client.aliases.get(args[1]));
            if(!command) return message.reply("Uhh... Seems like I do not even have that command. Why whitelisting something that I don't even have?");
            if(!server.blacklistedCommands.includes(command.name)) return message.reply("Uhh... That command seems to be in whitelist already.");
            let ind = server.blacklistedCommands.indexOf(command.name);
            server.blacklistedCommands.splice(ind, 1);
            await server.save().catch(e => console.log(e));
            return message.channel.send(embed.setDescription("Command has been successfully whitelisted! Everyone can use that command in this server now!"))
          }
          break;
        case "antialt":
          server.antialtModule = server.antialtModule ? false : true;
          await server.save().catch(e => console.log(e));
          return message.channel.send(embed.setDescription(`Anti-Alt module has been successfully ${server.antialtModule ? "Enabled" : "Disabled"}! All the accounts which were created in past ${ms(server.antialtAge, {long: true})} (You can chnge this setting by using \`config antialtage <new value>\` command.)`));
          break;
        case "antialtage":
          if(!args[1]) return message.channel.send(embed.setDescription(`The current Anti Alt minimum age is **${ms(server.antialtAge, {long: true})}**
To change this setting, use \`config antialtage <new value>\``));
          if(args[1]) {
            if(ms(args[1]) < 1000*60*60*24 || ms(args[1]) > 1000*60*60*24*7*8) return message.reply("You can not set the minimum account age to be either more than 8 weeks or less than 1 day. It must be between 1 day and 8 weeks.");
            embed.addField("Previous Value", ms(server.antialtAge, {long: true}));
            server.antialtAge = ms(args[1]);
            await server.save().catch(e => console.log(e));
            embed.addField("New Value", ms(server.antialtAge, {long: true}));
            return message.channel.send(embed.setDescription(`Successfully changed the Anti Alt minimum account age!`));
          }
      }
  });
}
}