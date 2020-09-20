const {Schema, model} = require("mongoose");

const user = new Schema({
  userID: {type: String},
  userName: {type: String},
  coins: {type: Number, default: 5},
  serverCooldown: {type: Array, default: []},
  dailyCooldown: {type: String, default: ""},
  premium: {type: Boolean, default: false},
  premiumDuration: {type: String, default: ""}
})

module.exports = model("dreamUser", user);