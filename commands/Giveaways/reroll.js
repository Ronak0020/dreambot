const DIscord = require("discord.js");

module.exports = {
  name: "reroll",
  category: "Giveaways",
  cooldown: 5,
  description: "Choose another winner for your giveaways.",
  aliases: ['greroll'],
  usage: "<messageID>",
  example: "reroll 749280711462355034",
  run: async(client, message, args) => {
    if(!message.member.permissions.has(["MANAGE_SERVER"])) return message.reply("Seems like you do not have permission to manage the giveaways.");
    const messageID = args[0];
			if(!messageID || isNaN(messageID)){
				return message.channel.send("Incorect message ID was provided! You need to provide me the message ID of the giveaway in order to reroll it.");
			}
			client.giveawaysManager.reroll(messageID).then(() => {
				return message.channel.send("Giveaway has been successfully rerolled!");
			}).catch(() => {
				return message.channel.send(`No giveaway was found with ID \`${args[0]}\``);
			});
  }
}