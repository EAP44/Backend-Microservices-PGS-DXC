const mongoose = require("mongoose");
const { Schema } = mongoose;

const DocumentSchema = new Schema(
  { titre: String, fichier: String },
  { _id: false }
);

const CommentaireSuiviSchema = new Schema(
  { date: Date, commentaire: String, auteur: String },
  { _id: false }
);

const StagiaireSchema = new Schema(
  {
    _id: { type: String, required: true },
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true },
    ecole: { type: String, required: true },
    specialite: { type: String, required: true },
    niveau: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    encadrantId: { type: String },
    status: {
      type: String,
      enum: ["Complète", "En attente", "Annulé"],
      default: "En attente",
    },
    conventionValidee: { type: Boolean, default: false },
    documents: [DocumentSchema],
    commentaires: [],
    
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stagiaire", StagiaireSchema);
