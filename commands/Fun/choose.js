const Discord = require("discord.js");
const {removeDuplicates} = require("../../utils/utils");

module.exports = {
  name: "choose",
  aliases: ["choice"],
  description: "Confused about what to choose? Let the bot decide for you!",
  cooldown: 10,
  category: "Fun",
  usage: "<choice1>, <choice2>, [choice3], [choice4] (and so on. Each choice must be separated by a coma `,`)",
  example: "choose i should play game, i should watch anime",
  run: async(client, message, args) => {
    const choices = args.join(" ").split(",");
    if(removeDuplicates(choices).length <= 1) return message.reply("Uhm... How can someone choose something when you have one one choice available?");
    const embed = new Discord.MessageEmbed()
    .setTitle("Choice Machine...")
    .setColor("#fcdfcf")
    .setTimestamp()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setFooter(client.user.username, client.user.displayAvatarURL());
    const msg = await message.channel.send(embed.setDescription(`**LOADING CHOICE MACHINE RESULTS**
Choosing from the below options:
${choices.join(" `|` ")}
Please wait for few seconds...`));
    let result = Math.floor(Math.random() * choices.length);
    setTimeout(() => {
      msg.edit(embed.setDescription(`I choose...
**${choices[result]}**!
You should go for **${choices[result]}** as per my opinion.`))
    }, 5000)
  }
}