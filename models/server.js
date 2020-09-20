const {model, Schema} = require("mongoose");

const server = new Schema({
  serverID: {type: String},
  serverOwner: {type: String},
  prefix: {type: String, default: "d."},
  premium: {type: Boolean, default: false},
  premiumDuration: {type: String, default: "None"},
  blacklistedChannels: [],
  blacklistedCommands: [],
  autoroleModule: {type: Boolean, default: false},
  autoroleRole: [],
  serverInfo: {type: String, default: "A cool server to join."},
  serverJoin: {type: Boolean, default: false},
  serverBalance: {type: Number, default: 0},
  inviteUrl: {type: String, default: ""},
  welcomeModule: {type: Boolean, default: false},
  leaveModule: {type: Boolean, default: false},
  welcomeMessage: {type: String, default: "Welcome to {serverName}, {memberMention} !"},
  leaveMessage: {type: String, default: "{memberUsername} left the server."},
  welcomeChannel: {type: String, default: "None"},
  leaveChannel: {type: String, default: "None"},
  welcomeEmbed: {type: String, default: "disabled"},
  levelModule: {type: Boolean, default: false},
  antialtModule: {type: Boolean, default: false},
  levelModule: {type: Boolean, default: false},
  antialtAge: {type: Number, default: 2419200000},
  earnXp: {type: Number, default: 25},
  levelUpMessageModule: {type: Boolean, default: true},
  levelUpMessageRedirect: {type: Boolean, default: false},
  levelUpMessageChannel: {type: String, default: ""},
  levelUpMessage: {type: String, default: "Congratulations {memberMention} ! You just advanced to level {level}! :tada:"}
});

module.exports = model("dreamServer", server);