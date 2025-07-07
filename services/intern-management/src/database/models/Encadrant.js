const mongoose = require("mongoose");
const { Schema } = mongoose;

const EncadrantSchema = new Schema(
  {
    _id: { type: String, required: true },
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true },
    specialite: { type: String, required: true },
    stagiairesEncadresIds: [],
    departement: { type: String, required: true },
    statut: { type: String, enum: ["actif", "inactif"], default: "actif" },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Encadrant", EncadrantSchema);
