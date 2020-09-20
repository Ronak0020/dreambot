const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "edit",
  category: "Giveaways",
  cooldown: 5,
  description: "Edit an ongoing giveaway.",
  aliases: ['gedit'],
  usage: "<messageID>",
  example: "edit 749280711462355034",
  run: async(client, message, args) => {
    if(!message.member.permissions.has(["MANAGE_SERVER"])) return message.reply("Seems like you do not have permission to manage the giveaways.");
    const messageID = args[0];
			if(!messageID || isNaN(messageID)){
				return message.channel.send("Incorect message ID was provided! You need to provide me the ID of the giveaway message in order to edit it.");
			}
    const embed = new Discord.MessageEmbed()
    .setTitle("Giveaway Edit")
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setColor("#cfa68c");
			const filter = (m) => m.author.id === message.author.id && !m.author.bot;
    const collector = await message.channel.createMessageCollector(filter, {time: 30000});
    const msg = await message.channel.send(embed.setDescription(`Please select what you want to edit.
Type the number of option in the chat within next 30 seconds to edit it.
**Options:**
\`1\` - Giveaway Prize
\`2\` - Giveaway Time
\`3\` - Giveaway Winner count`));
    collector.on("collect", async(response) => {
      let choice = response.content.toLowerCase();
      switch(choice) {
        case "1":
          response.delete();
          collector.stop(msg.edit(embed.setDescription(`**Prize Edit**
Type the new prize in the chat now. You have 30 seconds. After 30 seconds the edit menu will be deleted.`)));
          const col = await message.channel.createMessageCollector(filter, {time: 30000});
          col.on("collect", answer => {
            if(answer) {
              answer.delete();
              client.giveawaysManager.edit(messageID, {
             newPrize: answer.content
        });
              col.stop(msg.edit(embed.setDescription(`Giveaway with ID \`${messageID}\` has been successfully edited!`)))
            }
          })
          break;
        case "2":
          response.delete();
          collector.stop(msg.edit(embed.setDescription(`**Time Edit**
Type how many days/minuts/seconds you want to add in the giveaway. Example: 2d (for 2 days). Provide negative time to reduce the time (-2d). You have 30 seconds. After 30 seconds the edit menu will be deleted.`)));
          const col2 = await message.channel.createMessageCollector(filter, {time: 30000});
          col2.on("collect", answer => {
            if(answer) {
              answer.delete();
              if(isNaN(ms(answer.content))) return answer.reply("Provide a valid time.");
              client.giveawaysManager.edit(messageID, {
             addTime: ms(answer.content)
        });
              col2.stop(msg.edit(embed.setDescription(`Giveaway with ID \`${messageID}\` has been successfully edited!`)))
            }
          })
          break;
        case "3":
          response.delete();
          collector.stop(msg.edit(embed.setDescription(`**Time Edit**
Type how many winners you want in the giveaway. Example: 2 (for 2 winners). You have 30 seconds. After 30 seconds the edit menu will be deleted.`)));
          const col3 = await message.channel.createMessageCollector(filter, {time: 30000});
          col3.on("collect", answer => {
            if(answer) {
              answer.delete();
              if(isNaN(answer.content) || parseInt(answer.content) < 1) return answer.reply("Provide a valid number.");
              client.giveawaysManager.edit(messageID, {
             newWinnerCount: parseInt(answer.content)
        });
              col3.stop(msg.edit(embed.setDescription(`Giveaway with ID \`${messageID}\` has been successfully edited!`)))
            }
          })
          break;
      }
    })
  }
}