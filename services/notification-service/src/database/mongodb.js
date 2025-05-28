const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connecté à MongoDB avec succès"); // debug to remove
  } catch (err) {
    console.error("Erreur de connexion à MongoDB :", err); // debug to remove
    process.exit(1);
  }
}

module.exports = connectDB;
