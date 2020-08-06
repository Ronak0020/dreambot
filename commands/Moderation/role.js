const Discord = require('discord.js');

module.exports = {
    name: "role",
    category: "Moderation",
    description: "Add/remove a role from a user.",
    usage: "<@user> <@role | role name | role ID>",
    example: "role @Ronak @Member",
    cooldown: 5,
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(`**You do not have permission to use this command!**\n Please contact a staff member.`);
        let rMember = message.guild.members.cache.get(message.mentions.users.first().id) || message.guild.members.cache.get(args[0]);
        if (!rMember) return message.channel.send(`Didn't you forget to mention the user?`).then(m => m.delete({timeout: 10000}));
        let role = args.slice(1).join(" ");
        if (!role) return message.reply("Uhh... Provide a role as well please!");
        let gRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === role.toLowerCase()) || message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if (!gRole) return message.reply("Hmm... Seems like that role doesn't exists. Please recheck the spelling/ID of the role you provided.");
        if(message.member.roles.highest.position < gRole.position) return message.reply("You can not assign a role to someone which is higher than your roles!");
      await (rMember.roles.cache.has(gRole.id) ? rMember.roles.remove(gRole.id) : rMember.roles.add(gRole.id));
          message.channel.send(`Successfully ${rMember.roles.cache.has(gRole.id) ? "added" : "removed"} **${gRole.name}** role ${rMember.roles.cache.has(gRole.id) ? "to" : "from"} **${rMember.user.username}**.`)
        }
      }
