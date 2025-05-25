const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const DocumentSchema = new Schema(
  {titre: String,fichier: String,
  },
  { _id: false }
);

const CommentaireSuiviSchema = new Schema(
  {date: Date,commentaire: String,auteur: String,
  },
  { _id: false }
);

const StagiaireSchema = new Schema(
  {
    _id: {type: String,default: uuidv4,},
    nom: {type: String,required: true,trim: true,},
    prenom: {type: String,required: true,trim: true,},
    email: {type: String,required: true,unique: true,lowercase: true,},
    ecole: {type: String,required: true,},
    specialite: {type: String,required: true,},
    niveau: {type: String,required: true,},
    dateDebut: {type: Date,required: true,},
    dateFin: {type: Date,required: true,},
    encadrantId: {type: String,required: true,},
    status: {type: String,
      enum: ["En attente", "En cours", "Terminé", "Annulé"],
      default: "En attente",
    },
    conventionValidee: {type: Boolean,default: false,
    },
    documents: [DocumentSchema],
    commentaires: [CommentaireSuiviSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stagiaire", StagiaireSchema);









