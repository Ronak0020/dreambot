const {model, Schema} = require("mongoose");

const reqGive = new Schema({
  messageID: {type: String},
  roleRequirement: {type: String, default: ""},
  serverRequirement: {type: String, default: ""}
})

module.exports = model("requirementgiveaways", reqGive);