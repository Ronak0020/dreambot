const Discord = require ("discord.js");
const mongoose = require("mongoose");
const Levels = require("../../utils/levels");

module.exports = {
    name: 'leaderboard',
	description: 'Shows level leaderboard.',
    category: 'Levels',
    aliases: ["lb", "rlb"],
    cooldown: 5,
    run: async(client, message, args) => {

    let pageno = 1;
  
        const rawLeaderboard = await Levels.rawLeaderboard(message.guild.id, 50);
 
        if (rawLeaderboard.length < 1) return message.reply("Nobody's in leaderboard yet.");

        const leaderboard = Levels.mainLeaderboard(client, rawLeaderboard);
        const pos = rawLeaderboard.findIndex(i => i.guildID === message.guild.id && i.userID === message.author.id) + 1;
        const lb = leaderboard.map(e => `**${e.position}.** **${e.username}#${e.discriminator}**\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);
        
          const lbembed = lb;
          const lbEmbed = new Discord.MessageEmbed()
          .setColor('#009696')
          .setDescription(`${lbembed.slice(0, 5).join('\n')}`)
          .setAuthor(`${message.guild.name} Leaderboard`, message.guild.iconURL())
          .setFooter(`Your position: ${pos} | Page: 1`)
        const msg = await message.channel.send({
          embed: lbEmbed
        });

        if (lbembed.length > 5) {
            const reaction1 = await msg.react('◀');
            const reaction2 = await msg.react('▶');
      
            let first = 0;
            let second = 5;
      
            const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id, {
              time: 120000
            });
            collector.on('collect', (r) => {
              const reactionadd = lbembed.slice(first + 5, second + 5).length;
              const reactionremove = lbembed.slice(first - 5, second - 5).length;
      
              if (r.emoji.name === '▶' && reactionadd !== 0) {
              pageno = pageno + 1
                r.reaction.remove(message.author.id);
      
                first += 5;
                second += 5;
      
                const newEmbed = new Discord.MessageEmbed()
                  .setColor('#009696')
                  .setAuthor(`${message.guild.name} Leaderboard`, message.guild.iconURL)
      
                newEmbed.setDescription(`${lbembed.slice(first, second).join('\n')}`);
                newEmbed.setFooter(`Your position: ${pos} | Page: ${pageno}`);
     
                msg.edit({
                  embed: newEmbed
                });
              }
              else if (r.emoji.name === '◀' && reactionremove !== 0) {
                r.reaction.remove(message.author.id);
               pageno = pageno - 1
                first -= 5;
                second -= 5;
      
                const newEmbed = new Discord.MessageEmbed()
                  .setColor('#009696')
                  .setAuthor(`Leaderboard`, message.guild.iconURL)
                newEmbed.setDescription(`${lbembed.slice(first, second).join('\n')}`);
                newEmbed.setFooter(`Your position: ${pos} | Page: ${pageno}`);
      
                msg.edit({
                  embed: newEmbed
                })
              }
            });
            collector.on('end', () => {
              reaction1.reaction.remove();
              reaction2.reaction.remove();
            })
          }
        }
    }

