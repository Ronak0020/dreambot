const { MessageEmbed, version: djsversion } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const os = require('os');
const { formatBytes } = require("../../utils/utils");

module.exports = {
    name: "stats",
    category: "Info",
    cooldown: 3,
    description: "Check the system information of this bot.",
    aliases: ["bot"],
    run: async(client, message, args) => {
      const core = os.cpus()[0];
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(message.guild.me.displayHexColor || 'BLUE')
            .addField('System Information', [
				`**❯ Platform:** ${process.platform}`,
				`**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
				`**❯ CPU:**`,
				`\u3000\u3000 Cores: ${os.cpus().length}`,
				`\u3000\u3000 Model: ${core.model}`,
				`\u3000\u3000 Speed: ${core.speed}MHz`,
				`**❯ Memory:**`,
				`\u3000\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
				`\u3000\u3000 Used: ${formatBytes(process.memoryUsage().heapUsed)}`
			])

            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());
            message.channel.send(embed);
    }
}