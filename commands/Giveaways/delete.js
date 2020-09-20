const DIscord = require("discord.js");

module.exports = {
  name: "delete",
  category: "Giveaways",
  cooldown: 5,
  description: "Delete a giveaway.",
  aliases: ['gdelete'],
  usage: "<messageID>",
  example: "delete 749280711462355034",
  run: async(client, message, args) => {
    if(!message.member.permissions.has(["MANAGE_SERVER"])) return message.reply("Seems like you do not have permission to manage the giveaways.");
    const messageID = args[0];
			if(!messageID || isNaN(messageID)){
				return message.channel.send("Incorect message ID was provided! You need to provide me the ID of the giveaway message in order to delete it.");
			}
			try {
				client.giveawaysManager.delete(messageID, false);
				return message.channel.send("Giveaway has been successfully deleted!");
			} catch(e){
				return message.channel.send(`No giveaways was found with ID \`${args[0]}\``)
			}
  }
}