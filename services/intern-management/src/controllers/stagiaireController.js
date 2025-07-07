// const axios = require("axios");
// const mongoose = require("mongoose");
// const Stagiaire = require('../database/models/Stagiaire');
// const stagiaireSchema = require('../validations/stagiaireValidation');
// const Encadrant = require('../database/models/Encadrant');
// const encadrantSchema = require('../validations/encadrantValidation');
// const FormData = require("form-data");
// const fs = require("fs");

// exports.getAllStagiaires = async (req, res, next) => {
//   try {
//     const stagiaires = await Stagiaire.find();
//     res.json(stagiaires);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getStagiaireById = async (req, res, next) => {
//   try {
//     const stagiaire = await Stagiaire.findById(req.params.id);
//     if (!stagiaire) return res.status(404).json({ error: "Stagiaire non trouvé." });
//     res.json(stagiaire);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateStagiaire = async (req, res, next) => {
//   try {
//     const stagiaire = await Stagiaire.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });
//     if (!stagiaire) return res.status(404).json({ error: "Stagiaire non trouvé." });
//     res.json(stagiaire);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.softDelete = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedStagiaire = await Stagiaire.findByIdAndUpdate(
//       id,
//       { isDeleted: true, deletedAt: new Date() },
//       { new: true }
//     );

//     if (!updatedStagiaire) {
//       return res.status(404).json({ message: 'Stagiaire non trouvé.' });
//     }

//     res.json({ message: 'Stagiaire supprimé temporairement.', stagiaire: updatedStagiaire });
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la suppression temporaire.', error });
//   }
// };

// exports.restore = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const restoredStagiaire = await Stagiaire.findByIdAndUpdate(
//       id,
//       { isDeleted: false, deletedAt: null },
//       { new: true }
//     );

//     if (!restoredStagiaire) {
//       return res.status(404).json({ message: 'Stagiaire non trouvé.' });
//     }

//     res.json({ message: 'Stagiaire restauré avec succès.', stagiaire: restoredStagiaire });
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la restauration.', error });
//   }
// };

// exports.deleted = async (req, res) => {
//   try {
//     const deletedStagiaires = await Stagiaire.find({ isDeleted: true }).sort({ deletedAt: -1 });
//     res.json(deletedStagiaires);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la récupération des stagiaires supprimés.', error });
//   }
// };

// exports.stagiaires = async (req, res) => {
//   try {
//     const { isDeleted = 'false' } = req.query;
//     const filter = isDeleted === 'true'
//       ? { isDeleted: true }
//       : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };

//     const stagiaires = await Stagiaire.find(filter);
//     res.json(stagiaires);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la récupération des stagiaires.', error });
//   }
// };

// exports.deleteStagiaire = async (req, res, next) => {
//   try {
//     const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
//     if (!stagiaire) return res.status(404).json({ error: "Stagiaire non trouvé." });
//     res.json({ message: "Stagiaire supprimé définitivement." });
//   } catch (err) {
//     next(err);
//   }
// };

// // ----------------- Encadrants -----------------

// exports.getAllEncadrants = async (req, res, next) => {
//   try {
//     const encadrant = await Encadrant.find();
//     res.json(encadrant);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getEncadrantById = async (req, res, next) => {
//   try {
//     const encadrant = await Encadrant.findById(req.params.id);
//     if (!encadrant) return res.status(404).json({ error: "Encadrant non trouvé." });
//     res.json(encadrant);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.createManyEncadrants = async (req, res, next) => {
//   try {
//     if (!Array.isArray(req.body)) {
//       return res.status(400).json({ error: "Une liste d'encadrants est attendue." });
//     }

//     const validatedEncadrants = [];
//     for (const item of req.body) {
//       const { error, value } = encadrantSchema.validate(item);
//       if (error) {
//         return res.status(400).json({ error: `Échec de la validation : ${error.details[0].message}` });
//       }
//       validatedEncadrants.push(value);
//     }

//     const insertedEncadrants = await Encadrant.insertMany(validatedEncadrants);
//     res.status(201).json(insertedEncadrants);
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(409).json({ error: "Doublon détecté. Un e-mail existe peut-être déjà." });
//     }
//     next(err);
//   }
// };

// //__________________________________________________________________________ new

// exports.getDashboardStats = async (req, res, next) => {
//   try {
//     const totalInterns = await Stagiaire.countDocuments({ isDeleted: { $ne: true } });
//     const totalSupervisors = await Encadrant.countDocuments();
//     const activeInternships = await Stagiaire.countDocuments({
//       status: "Complète",
//       isDeleted: { $ne: true },
//     });
//     const pendingInterns = await Stagiaire.countDocuments({
//       status: "En attente",
//       isDeleted: { $ne: true },
//     });

//     res.json({
//       totalInterns,
//       totalSupervisors,
//       activeInternships,
//       pendingInterns,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.', error });
//   }
// };

// exports.getPendingInterns = async (req, res, next) => {
//   try {
//     const pendingInterns = await Stagiaire.find({
//       status: "En attente",
//       isDeleted: { $ne: true },
//     });
//     res.json(pendingInterns);
//   } catch (error) {
//     res.status(500).json({ message: "Erreur lors de la récupération des stagiaires en attente.", error });
//   }
// };

// exports.updateStagiaireStatus = async (req, res, next) => {
//   try {
//     const { id, status } = req.body;

//     if (!id) {
//       return res.status(400).json({ error: "L'identifiant du stagiaire est requis." });
//     }

//     if (!["Complète", "En attente", "Annulé"].includes(status)) {
//       return res.status(400).json({ error: "Statut invalide. Les statuts valides sont : Complète, En attente, Annulé." });
//     }

//     const updatedStagiaire = await Stagiaire.findOneAndUpdate(
//       { _id: id },
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!updatedStagiaire) {
//       return res.status(404).json({ error: "Stagiaire non trouvé avec l'identifiant fourni." });
//     }

//     res.json({
//       message: "Statut mis à jour avec succès.",
//       stagiaire: updatedStagiaire
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// //___________________________________________________________________________________________________new

// async function generateStagiaireId() {
//   const last = await Stagiaire.findOne({}).sort({ createdAt: -1 }).select("_id").lean();
//   if (!last || !/^S\d+$/.test(last._id)) return "S1";
//   const lastNum = parseInt(last._id.substring(1));
//   return `S${lastNum + 1}`;
// }

// exports.createStagiaire = async (req, res, next) => {
//   try {
//     const { error, value } = stagiaireSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const {
//       nom,
//       prenom,
//       email,
//       phoneNumber,
//       ecole,
//       specialite,
//       niveau,
//       dateDebut,
//       dateFin,
//       encadrantId,
//       sujet,
//       description,
//       competences,
//     } = value;

//     if (!encadrantId) {
//       return res.status(400).json({ error: "L'identifiant de l'encadrant est requis." });
//     }

//     const encadrant = await Encadrant.findById(encadrantId).select("email");
//     if (!encadrant) {
//       return res.status(404).json({ error: "Aucun encadrant trouvé avec cet identifiant." });
//     }

//     const encadrantEmail = encadrant.email;

//     const stagiaireId = await generateStagiaireId();

//     const uploadedFiles = {};
//     const requiredFiles = ["CV", "ConventionDeStage"];
//     for (const fileKey of requiredFiles) {
//       if (!req.files || !req.files[fileKey]) {
//         return res.status(400).json({ error: `Le fichier ${fileKey} est requis.` });
//       }
//     }

//     const fileKeys = ["CV", "ConventionDeStage", "DemandeDeStage"];
//     for (const fileKey of fileKeys) {
//       if (req.files && req.files[fileKey]) {
//         const file = req.files[fileKey];

//         const form = new FormData();
//         form.append("file", fs.createReadStream(file.path), file.originalname);
//         form.append("metadata", JSON.stringify({
//           stagiaireId: stagiaireId,
//           uploadedBy: "rh",
//           tags: [fileKey.toLowerCase(), "pdf"]
//         }));

//         try {
//           const uploadRes = await axios.post("http://localhost:3020/api/files/upload", form, {
//             headers: form.getHeaders(),
//           });
//           uploadedFiles[fileKey] = uploadRes.data._id;
//         } catch (uploadErr) {
//           console.error(`[Erreur upload fichier ${fileKey}]`, uploadErr.message);
//           return res.status(500).json({ error: `Échec du téléversement de ${fileKey}` });
//         }
//       }
//     }
//     const newStagiaire = new Stagiaire({
//       _id: stagiaireId,
//       nom,
//       prenom,
//       email,
//       phoneNumber,
//       ecole,
//       specialite,
//       niveau,
//       dateDebut,
//       dateFin,
//       sujet,
//       description,
//       competences,
//       encadrantId,
//       status: "En attente",
//       conventionValidee: false,
//       documents: {
//         cv: uploadedFiles.CV,
//         conventionDeStage: uploadedFiles.ConventionDeStage,
//         demandeDeStage: uploadedFiles.DemandeDeStage || null,
//       },
//     });

//     await newStagiaire.save();

//     try {
//       await axios.post("http://localhost:3030/api/notify", {
//         encadrantId,
//         encadrantEmail,
//         stagiaireName: `${nom} ${prenom}`,
//         stagiaireEmail: email,
//       });
//     } catch (notifyErr) {
//       console.error("[Notification erreur]", notifyErr.message);
//     }

//     return res.status(201).json({
//       message: "Stagiaire créé avec succès.",
//       stagiaire: newStagiaire,
//     });
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern?.email) {
//       return res.status(409).json({ error: "Cet e-mail existe déjà." });
//     }
//     next(err);
//   }
// };

const axios = require("axios");
const mongoose = require("mongoose");
const FormData = require("form-data");
const fs = require("fs");

const Stagiaire = require("../database/models/Stagiaire");
const Encadrant = require("../database/models/Encadrant");
const stagiaireSchema = require("../validations/stagiaireValidation");
const encadrantSchema = require("../validations/encadrantValidation");
const streamifier = require('streamifier');


// Génération d'un ID stagiaire de type S1, S2, ...
async function generateStagiaireId() {
  const last = await Stagiaire.findOne({})
    .sort({ createdAt: -1 })
    .select("_id")
    .lean();
  if (!last || !/^S\d+$/.test(last._id)) return "S1";
  const lastNum = parseInt(last._id.substring(1));
  return `S${lastNum + 1}`;
}

// ======== CRUD Stagiaire ========

exports.getAllStagiaires = async (req, res, next) => {
  try {
    const stagiaires = await Stagiaire.find();
    res.json(stagiaires);
  } catch (err) {
    next(err);
  }
};

exports.getStagiaireById = async (req, res, next) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id);
    if (!stagiaire)
      return res.status(404).json({ error: "Stagiaire non trouvé." });
    res.json(stagiaire);
  } catch (err) {
    next(err);
  }
};

exports.createStagiaire = async (req, res, next) => {
  try {
    // Validation entrée
    // const { error, value } = stagiaireSchema.validate(req.body);
    // if (error) return res.status(400).json({ error: error.details[0].message });
    const {
      nom,
      prenom,
      email,
      phoneNumber,
      ecole,
      specialite,
      niveau,
      dateDebut,
      dateFin,
      encadrantId,
      sujet = "",
      description = "",
      competences = "",
    } = req.body;

    if (!encadrantId) {
      return res
        .status(400)
        .json({ error: "L'identifiant de l'encadrant est requis." });
    }

    // Vérifier encadrant
    const encadrant = await Encadrant.findById(encadrantId).select("email");
    if (!encadrant) {
      return res
        .status(404)
        .json({ error: "Aucun encadrant trouvé avec cet identifiant." });
    }

    // Générer ID stagiaire
    const stagiaireId = await generateStagiaireId();

    // Vérifier fichiers obligatoires
    const requiredFiles = ["CV", "ConventionDeStage"];
    for (const key of requiredFiles) {
      if (!req.files || !req.files[key]) {
        return res.status(400).json({ error: `Le fichier ${key} est requis.` });
      }
    }

    const uploadedFiles = {};
    const fileKeys = ["CV", "ConventionDeStage", "DemandeDeStage"];
      for (const fileKey of fileKeys) {
        if (req.files && req.files[fileKey] && req.files[fileKey][0]) {
          const file = req.files[fileKey][0];

          const form = new FormData();

          form.append("file", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
          });

          form.append(
            "metadata",
            JSON.stringify({
              stagiaireId: stagiaireId,
              uploadedBy: "rh",
              tags: [fileKey.toLowerCase(), "pdf"],
            })
          );

          try {
            const uploadRes = await axios.post("http://127.0.0.1:3020/api/files/upload", form, {
              headers: form.getHeaders(),
            });

            uploadedFiles[fileKey] = uploadRes.data.id || uploadRes.data._id;
          } catch (uploadErr) {
            console.error(`[Erreur upload fichier ${fileKey}]`, uploadErr.response?.data || uploadErr.message);
            return res.status(500).json({ error: `Échec du téléversement de ${fileKey}` });
          }
        }
      }


    // Créer stagiaire en DB
    const newStagiaire = new Stagiaire({
      _id: stagiaireId,
      nom,
      prenom,
      email,
      phoneNumber,
      ecole,
      specialite,
      niveau,
      dateDebut,
      dateFin,
      sujet,
      description,
      competences,
      encadrantId,
      status: "En attente",
      conventionValidee: false,
      documents: {
        cv: uploadedFiles.CV,
        conventionDeStage: uploadedFiles.ConventionDeStage,
        demandeDeStage: uploadedFiles.DemandeDeStage || null,
      },
      commentaires: [], // Pas de commentaire à la création
    });

    await newStagiaire.save();
    // Notification à l'encadrant
    try {
      await axios.post("http://127.0.0.1:3030/api/notify", {
        encadrantId,
        encadrantEmail: encadrant.email,
        stagiaireName: `${nom} ${prenom}`,
        stagiaireEmail: email,
      });
    } catch (notifyErr) {
      console.error("[Notification erreur]", notifyErr.message);
    }

    return res.status(201).json({
      message: "Stagiaire créé avec succès.",
      stagiaire: newStagiaire,
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({ error: "Cet e-mail existe déjà." });
    }
    next(err);
  }
};

exports.updateStagiaire = async (req, res, next) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!stagiaire)
      return res.status(404).json({ error: "Stagiaire non trouvé." });
    res.json(stagiaire);
  } catch (err) {
    next(err);
  }
};

exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStagiaire = await Stagiaire.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!updatedStagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé." });
    }
    res.json({
      message: "Stagiaire supprimé temporairement.",
      stagiaire: updatedStagiaire,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression temporaire.", error });
  }
};

exports.restore = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredStagiaire = await Stagiaire.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!restoredStagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé." });
    }
    res.json({
      message: "Stagiaire restauré avec succès.",
      stagiaire: restoredStagiaire,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la restauration.", error });
  }
};

exports.deleted = async (req, res) => {
  try {
    const deletedStagiaires = await Stagiaire.find({ isDeleted: true }).sort({
      deletedAt: -1,
    });
    res.json(deletedStagiaires);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des stagiaires supprimés.",
        error,
      });
  }
};

exports.stagiaires = async (req, res) => {
  try {
    const { isDeleted = "false" } = req.query;
    const filter =
      isDeleted === "true"
        ? { isDeleted: true }
        : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };

    const stagiaires = await Stagiaire.find(filter);
    res.json(stagiaires);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des stagiaires.",
        error,
      });
  }
};

exports.deleteStagiaire = async (req, res, next) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
    if (!stagiaire)
      return res.status(404).json({ error: "Stagiaire non trouvé." });
    res.json({ message: "Stagiaire supprimé définitivement." });
  } catch (err) {
    next(err);
  }
};

// ======== CRUD Encadrants ========

exports.getAllEncadrants = async (req, res, next) => {
  try {
    const encadrants = await Encadrant.find();
    res.json(encadrants);
  } catch (err) {
    next(err);
  }
};

exports.getEncadrantById = async (req, res, next) => {
  try {
    const encadrant = await Encadrant.findById(req.params.id);
    if (!encadrant)
      return res.status(404).json({ error: "Encadrant non trouvé." });
    res.json(encadrant);
  } catch (err) {
    next(err);
  }
};

exports.createManyEncadrants = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ error: "Une liste d'encadrants est attendue." });
    }

    const validatedEncadrants = [];
    for (const item of req.body) {
      const { error, value } = encadrantSchema.validate(item);
      if (error) {
        return res.status(400).json({
          error: `Échec de la validation : ${error.details[0].message}`,
        });
      }
      if (!value.statut) value.statut = "actif";
      if (value.disponible === undefined) value.disponible = true;

      validatedEncadrants.push(value);
    }

    const insertedEncadrants = await Encadrant.insertMany(validatedEncadrants);
    res.status(201).json(insertedEncadrants);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Doublon détecté. Un e-mail existe peut-être déjà.",
      });
    }
    next(err);
  }
};


exports.deleteAllEncadrants = async (req, res, next) => {
  try {
    const result = await Encadrant.deleteMany({});
    res.status(200).json({
      message: `${result.deletedCount} encadrants supprimés avec succès.`,
    });
  } catch (err) {
    next(err);
  }
};


// ===== Statistiques dashboard

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalInterns = await Stagiaire.countDocuments({
      isDeleted: { $ne: true },
    });
    const totalSupervisors = await Encadrant.countDocuments();
    const activeInternships = await Stagiaire.countDocuments({
      status: "Complète",
      isDeleted: { $ne: true },
    });
    const pendingInterns = await Stagiaire.countDocuments({
      status: "En attente",
      isDeleted: { $ne: true },
    });

    res.json({
      totalInterns,
      totalSupervisors,
      activeInternships,
      pendingInterns,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des statistiques.",
        error,
      });
  }
};

exports.getPendingInterns = async (req, res, next) => {
  try {
    const pendingInterns = await Stagiaire.find({
      status: "En attente",
      isDeleted: { $ne: true },
    });
    res.json(pendingInterns);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des stagiaires en attente.",
        error,
      });
  }
};

exports.updateStagiaireStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "L'identifiant du stagiaire est requis." });
    }

    if (!["Complète", "En attente", "Annulé"].includes(status)) {
      return res.status(400).json({
        error:
          "Statut invalide. Les statuts valides sont : Complète, En attente, Annulé.",
      });
    }

    const updatedStagiaire = await Stagiaire.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedStagiaire) {
      return res
        .status(404)
        .json({ error: "Stagiaire non trouvé avec l'identifiant fourni." });
    }

    res.json({
      message: "Statut mis à jour avec succès.",
      stagiaire: updatedStagiaire,
    });
  } catch (err) {
    next(err);
  }
};
