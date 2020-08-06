const Discord = require("discord.js");

module.exports = {
  name: "unlock",
  category: "Moderation",
  description: "Unlock a channel and allow users to be able to chat in the channel again.",
  usage: "[#channel | channel ID]",
  cooldown: 5,
  example: "unlock #general",
  run: async(client, message, args) => {
    if(!message.member.permissions.has(["MANAGE_CHANNELS"])) return message.reply("You do not have permission to use this command!");
    const chn = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    if(!chn) return message.channel.send("You also need to mention the channel to unlock.");
    chn.updateOverwrite(message.guild.roles.everyone, {
      SEND_MESSAGES: null
    });
    message.channel.send(`Successfully unlocked <#${chn.id}>. Use \`lock\` command to lock the channel again.`);
  }
}