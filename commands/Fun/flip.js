const {MessageEmbed} = require("discord.js");

module.exports = {
  name: "flip",
  aliases: ["coinflip", "cf"],
  description: "Flip a coin and check whether it's HEADS or TAILS!",
  cooldown: 5,
  category: "Fun",
  usage: "<heads/tails>",
  example: "flip heads",
  run: async(client, message, args) => {
    let options = ["heads", "tails"]
    if(!args[0] || !options.includes(args[0].toLowerCase())) return message.reply("What do you choose? Heads or Tails? You need to specify it as well with the command.");
    const embed = new MessageEmbed()
    .setTitle("Coin Flip - " + args[0])
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setColor("#dcfff5");
    let result = options[Math.floor(Math.random() * options.length)];
    let comp = options[Math.floor(Math.random() * options.length)];
    message.channel.send(embed.setDescription(`**Flipping the coin!**
**Your Choice:** \`${args[0]}\`
**Computer Choice:** \`${comp}\`
**Result:** ${result}
**${result === args[0].toLowerCase() ? "You Win!" : "Computer Wins!"}**`));
  }
}