const {MessageEmbed, Collection, Client} = require("discord.js");
const fs = require("fs");
const ms = require("ms");

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.cooldowns = new Collection();

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

  client.login("NzM1ODAzNTM2ODM0NjkxMDky.XxlldA.IEmdmEjF30bf0GQ0B7MbqBHp6LU")