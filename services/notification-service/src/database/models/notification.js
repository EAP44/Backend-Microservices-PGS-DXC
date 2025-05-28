const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  encadrantId: { type: String, required: true },
  encadrantEmail: { type: String, required: true },
  stagiaireName: { type: String, required: true },
  stagiaireEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);

