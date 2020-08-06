const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "say",
    description: "Says your text.",
    usage: "<text>",
    category: "Moderation",
    cooldown: 5,
    example: "say Hello! I am a bot!",
    run: (client, message, args) => {
        message.delete();

        if (!message.member.permissions.has("MANAGE_MESSAGES"))
            return message.reply("You don't have the required permissions to use this command.").then(m => m.delete({timeout: 5000}));

        if (args.length < 1)
            return message.reply("Nothing to say? Well then, I can say nothing as well.").then(m => m.delete({timeout: 5000}));

        const roleColor = message.guild.me.roles.highest.hexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new MessageEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}