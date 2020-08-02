const { MessageEmbed, version: djsversion } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const { utc } = require('moment');

module.exports = {
    name: "botinfo",
    category: "Info",
    cooldown: 3,
    description: "Check the information about this bot.",
    aliases: ["bot"],
    run: async(client, message, args) => {
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(message.guild.me.displayHexColor || 'BLUE')
            .addField('Bot Information', [
                `**-> Client:** ${client.user.tag} (${client.user.id})`,
                `**-> Commands:** ${client.commands.size}`,
                `**-> Servers:** ${client.guilds.cache.size.toLocaleString()} `,
                `**-> Users:** ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
                `**-> Channels:** ${client.channels.cache.size.toLocaleString()}`,
                `**-> Creation Date:** ${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
                `**-> Node.js:** ${process.version}`,
                `**-> Discord.js:** v${djsversion}`
            ])
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());
            message.channel.send(embed);
    }
}