const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  subscription: Object,
});

module.exports = mongoose.model("Token", tokenSchema);