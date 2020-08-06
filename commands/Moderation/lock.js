const Discord = require("discord.js");

module.exports = {
  name: "lock",
  category: "Moderation",
  description: "Lock a channel and stop everyone from sendong messages in it.",
  usage: "[#channel | channel ID]",
  cooldown: 5,
  example: "lock #general",
  run: async(client, message, args) => {
    if(!message.member.permissions.has(["MANAGE_CHANNELS"])) return message.reply("You do not have permission to use this command!");
    const chn = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    if(!chn) return message.channel.send("You also need to mention the channel to lock.");
    chn.updateOverwrite(message.guild.roles.everyone, {
      SEND_MESSAGES: false
    });
    message.channel.send(`Successfully locked <#${chn.id}>. Use \`unlock\` command to unlock the channel.`);
  }
}