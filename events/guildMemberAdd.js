const Discord = require("discord.js");
const Server = require("../models/server");
const ms = require("ms");

module.exports = async(guild, member) => {
  console.log(member.id);
  console.log(guild.id);
  console.log(member.guild.id);
  Server.findOne({
    serverID: member.guild.id
  }, async(err, server) => {
    if(err) console.log(err);
    if(server.antialtModule) {
      if(Date.now() - member.user.createdAt < server.antialtAge) {
        const DM = await member.createDM();
        DM.send(`Sorry but you are not allowed in the server **${member.guild.name}** because they have set Anti-Alt and accounts which are younger than ${ms(server.antialtAge, {long: true})} are not allowed.`);
        await member.kick()
      }
    }
  })
}