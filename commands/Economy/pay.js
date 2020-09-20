const Discord = require('discord.js')
const mongoose = require("mongoose");
const Coins = require("../../models/user.js");


module.exports = {
    name: 'pay',
    category: "Economy",
    aliases: ["give"],
    cooldown: 30,
    description: "Your friend is poor? Give them some Fren coins from your pockey!",
    usage: "<user mention> <amount>",
    example: "pay @Ronak 100",
    run: async(client, message, args) => {

        let target = message.mentions.members.first();
        if (!target || target.id === message.author.id) return message.reply("Mention a valid member whom you wanna pay! (You also cant pay yourself!)").then(m => m.delete({timeout: 10000}));
        if(target.user.bot) return message.reply("Dont waste your money on NON-HUMANS!");
        let amt = parseInt(args[1]);
        if (isNaN(amt) || amt < 1) return message.reply("Please enter a valid amount").then(r => r.delete({timeout: 10000}));

        let embed = new Discord.MessageEmbed()
            .setTitle("Pay")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setThumbnail(message.author.displayAvatarURL());

        Coins.findOne({
            userID: message.author.id
        }, (err, sender) => {
            if (err) console.log(err);

            if (!sender) {
            embed.setColor("RED");
            embed.addField("Error", "Sorry, you don't have any Discord coins to send...");
            return message.channel.send(embed);
            } else {
            if (amt > sender.coins) return message.reply("Sorry, you do not have that much discord coins.!").then(r => r.delete({timeout: 10000}));
            Coins.findOne({
                userID: target.id
            }, (err, receiver) => {
                if (err) console.log(err);
                sender.coins -= amt;
                sender.save().catch(err => console.log(err));

                if (!receiver) {
                const newTargetRes = new Coins({
                    userID: target.id,
                    coins: amt
                })
                newTargetRes.save().catch(err => console.log(err))
                } else {
                receiver.coins += amt;
                receiver.save().catch(err => console.log(err))
                }
            })
            embed.setColor("#adcfaf")
            embed.addField("Discord Coins sent!", amt.toLocaleString() + " Discord coins have been sent to " + target.user.username + ".")
            message.channel.send(embed);
            }
        })
}
}