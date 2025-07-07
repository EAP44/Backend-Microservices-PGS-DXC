const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentaireSuiviSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    commentaire: { type: String, required: true },
    auteur: { type: String, required: true },
  },
  { _id: false }
);

const StagiaireSchema = new Schema(
  {
    _id: { type: String, required: true },
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: { type: String, required: true, trim: true },
    ecole: { type: String, required: true, trim: true },
    specialite: { type: String, required: true, trim: true },
    niveau: { type: String, required: true, trim: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },

    sujet: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    competences: { type: String, default: "", trim: true },

    encadrantId: { type: String, required: true },

    status: {
      type: String,
      enum: ["Complète", "En attente", "Annulé"],
      default: "En attente",
    },

    conventionValidee: { type: Boolean, default: false },

    documents: {
      cv: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentMetadata",
        required: true,
      },
      conventionDeStage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentMetadata",
        required: true,
      },
      demandeDeStage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentMetadata",
        required: false,
      },
    },

    commentaires: {
      type: [CommentaireSuiviSchema],
      default: [],
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stagiaire", StagiaireSchema);
