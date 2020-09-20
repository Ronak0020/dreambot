const {MessageEmbed, Collection, Client} = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const { GiveawaysManager } = require("discord-giveaways");
const REQ = require("./models/reqgiveaways.js");

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.cooldowns = new Collection();

// Starts updating currents giveaways
const manager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});
client.giveawaysManager = manager;

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

fs.readdir('./events/', (err, files) => {
    files = files.filter(f => f.endsWith('.js'));
    files.forEach(f => {
        const event = require(`./events/${f}`);
        client.on(f.split('.')[0], event.bind(null, client));
        delete require.cache[require.resolve(`./events/${f}`)];
    });
  });

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  
  let embed = new MessageEmbed()
  .setTitle("Entry Denied!")
  .setTimestamp()
  .setColor("RED")
  .setFooter(client.user.username, client.user.displayAvatarURL());
  
  REQ.findOne({
    messageID: giveaway.messageID
  }, async(err, give) => {
    if(err) console.log(err);
    if(!give) return;
    if(give.roleRequirement !== "none") {
      if(!member.roles.cache.has(give.roleRequirement)) {
        reaction.users.remove(member.user);
        member.user.send(embed.setDescription(`Your entry for the giveaway of **${giveaway.prize}** has been declined!
You need to have the role **${member.guild.roles.cache.get(give.roleRequirement).name}** in order to be able to participate.`))
      }
    }
    if(give.serverRequirement !== "none") {
      if(!client.guilds.cache.get(give.serverRequirement).members.includes(member)) {
        reaction.users.remove(member.user);
        member.user.send(embed.setDescription(`Your entry for the giveaway of **${giveaway.prize}** has been declined!
You need to be in server **${client.guilds.cache.get(give.serverRequirement).name}** in order to be able to participate.`))
      }
    }
  })
})

  client.login(process.env.TOKEN)