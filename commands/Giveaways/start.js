const Discord = require("discord.js");
const ms = require("ms");
const REQ = require("../../models/reqgiveaways.js");

module.exports = {
  name: "giveawaystart",
  aliases: ["gstart"],
  description: "Start a giveaway using this command.",
  usage: "<time> <winners> <prize>",
  example: "giveawaystart 24h 1 Nitro Classic",
  cooldown: 10,
  category: "Giveaways",
  run: async(client, message, args) => {
    if(!message.member.permissions.has(["MANAGE_SERVER"])) return message.reply("Seems like you do not have permission to manage the giveaways.");
    const currentGiveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
		let role = "none";
    let time = "";
		let winnersCount;
		let prize = "";
    let channel = "";
    let serverID = "none";
    let embed = new Discord.MessageEmbed()
    .setTitle("Giveaways Menu")
    .setColor("#caf5cf")
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp();
    
    const msg = await message.channel.send(embed.setDescription("In which channel you want the giveaway to start?\nPlease mention the channel or provide the ID of channel.\nYou have 30 seconds to response."));
    
    const filter = (m) => m.author.id === message.author.id && !m.author.bot;
    const collector = await message.channel.createMessageCollector(filter, {max: 3, time: 30000});
    
    collector.on("collect", async(collect) => {
      const response = collect.content;
      let chn = collect.mentions.channels.first() || message.guild.channels.cache.get(response);
      if(!chn) msg.edit(embed.setDescription("Invalid channel was provided! Please try again."));
      channel = chn;
      collector.stop(msg.edit(embed.setDescription(`Alright! Next, What should be the duration of the giveaway?\nReply within 30 seconds.`)));
      const collector2 = await message.channel.createMessageCollector(filter, {max: 3, time: 30000});
      collector2.on("collect", async(collect2) => {
      let mss = ms(collect2.content);
      if(!ms) msg.edit(embed.setDescription("Invalid duration was provided! Please try again."));
      time = mss;
      collector2.stop(msg.edit(embed.setDescription(`Alright! Next, How many winners should be there for the giveaway?\nReply within 30 seconds.`)));
      
      const collector3 = await message.channel.createMessageCollector(filter, {max: 3, time: 30000});
      collector3.on("collect", async(collect3) => {
      const response3 = collect3.content.toLowerCase();
      if(parseInt(response3) < 1 || isNaN(parseInt(response3))) msg.edit(embed.setDescription("Invalid winner count was provided! Please try again."));
      winnersCount = parseInt(response3);
      collector3.stop(msg.edit(embed.setDescription(`Alright! Next, What should be the prize for the giveaway?\nReply within 30 seconds.`)));
      const collector4 = await message.channel.createMessageCollector(filter, {max: 3, time: 30000});
        collector4.on("collect", async(collect4) => {
      const response4 = collect4.content.toLowerCase();
      prize = response4;
      collector4.stop(msg.edit(embed.setDescription(`Alright! Next, Do you want to have a role requirement for the giveaway? If yes, mention | provide ID | provide the name of the role.\nReply within 30 seconds.`)));
    
      const collector5 = await message.channel.createMessageCollector(filter, {max: 3, time: 30000});
      collector5.on("collect", async(collect5) => {
      const response5 = collect5.content.toLowerCase();
      if(response5 === "none") {
        collector5.stop(msg.edit(embed.setDescription(`Alright! Next, Do you want to have a server join requirement for the giveaway? If yes, provide the server ID.\nReply within 30 seconds.`)));
      } else {
        let rle = collect5.mentions.roles.first().id || message.guild.roles.cache.get(response5).id || message.guild.roles.everyone.id;
      if(!rle) msg.edit(embed.setDescription("Invalid role was provided! Please try again."))
      role = rle;
      collector5.stop(msg.edit(embed.setDescription(`Alright! Next, Do you want to have a server join requirement for the giveaway? If yes, provide the server ID.\nReply within 30 seconds.`)));
      }
      const collector6 = await message.channel.createMessageCollector(filter, {max: 3, time: 30000});
      collector6.on("collect", async(collect6) => {
      const response6 = collect6.content.toLowerCase();
      if(response6 === "none") {
        collector6.stop(msg.edit(embed.setDescription(`Alright! Giveaway has been started in ${channel} for **${prize}** which will last for **${ms(time, {long: true})}** and there will be **${winnersCount}** winner(s)!`)));
      } else {
        let server = client.guilds.cache.get(response6);
      if(!server) msg.edit(embed.setDescription("Invalid server id was provided or probably I am not in that server! Please try again."))
      serverID = server.id;
      collector6.stop(msg.edit(embed.setDescription(`Alright! Giveaway has been started in ${channel} for **${prize}** which will last for **${ms(time, {long: true})}** and there will be **${winnersCount}** winner(s)!`)));
      }
        console.log(time);
      client.giveawaysManager.start(channel, {
				time: parseInt(time),
				prize: prize,
        hostedBy: message.author,
				winnerCount: parseInt(winnersCount),
        //exemptMembers: (m) => role.length ? !m.roles.cache.includes(role) : !m.author.bot && serverID.length ? !client.guilds.cache.get(serverID).members.includes(m) : !m.author.bot,
				messages: {
					giveaway: "**Giveaway!**",
					giveawayEnded: "**GIVEAWAY ENDED**",
					timeRemaining: "Time remaining: **{duration}**!",
					inviteToParticipate: "React with 🎉 to participate!",
					winMessage: "Congratulations, {winners}! You won **{prize}**!",
					embedFooter: "Giveaways",
          hostedBy: "**Hosted By:** {user}",
					noWinner: "Giveaway was cancelled because there were no valid participations.",
					winners: "winner(s)",
					endedAt: "End at",
					units: {
						seconds: "seconds",
						minutes: "minutes",
						hours: "hours",
						days: "days"
					}	
				}
			}).then(g => REQ.findOne({
        messageID: g.messageID
      }, async(err, give) => {
        if(err) console.log(err);
        if(!give) {
          const newGive = new REQ({
            messageID: g.messageID,
            roleRequirement: role,
            serverRequirement: serverID
          })
          await newGive.save().catch(e => console.log(e))
        }
      }))
      })
      })
        })
      })
      })
    })
  }
}