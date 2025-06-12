// const axios = require("axios");
// const mongoose = require("mongoose");
// const Stagiaire = require('../database/models/Stagiaire');
// const stagiaireSchema = require('../validations/stagiaireValidation');
// const Encadrant = require('../database/models/Encadrant');
// const encadrantSchema = require('../validations/encadrantValidation');

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
//     if (!stagiaire) return res.status(404).json({ error: "Stagiaire not found" });
//     res.json(stagiaire);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.createStagiaire = async (req, res, next) => {
//   try {
//     const { error, value } = stagiaireSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }
//     const {
//       _id,
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
//       commentaires,
//       documents
//     } = value;

//     if (!encadrantId) {
//       return res.status(400).json({ error: "encadrantId est requis." });
//     }
//     const encadrant = await Encadrant.findById(encadrantId).select("email");
//     if (!encadrant) {
//       return res
//         .status(404)
//         .json({ error: "Aucun encadrant trouvé avec cet ID." });
//     }
//     const encadrantEmail = encadrant.email;

//     const newStagiaire = new Stagiaire({
//       _id,
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
//       status: "En attente",
//       conventionValidee: false,
//       documents,
//       commentaires,          
//     });

//     await newStagiaire.save();

//     try {
//       console.log("testtestetettst????????????????????????????????????????1");
//       await axios.post(
//         "http://localhost:3030/api/notify",
//         {
//           encadrantId,
//           encadrantEmail,
//           stagiaireName: `${nom} ${prenom}`,
//           stagiaireEmail: email,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       console.log("testtestetettst????????????????????????????????????????2");
//     } catch (notifyErr) {
//       console.error(
//         "[createStagiaire] La requête POST /api/notify a échoué:",
//         notifyErr.message || notifyErr.toString()
//       );
//     }
//     console.log("testtestetettst????????????????????????????????????????3");
//     return res.status(201).json(newStagiaire);
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
//       return res.status(409).json({ error: "Cet e-mail existe déjà." });
//     }
//     next(err);
//   }
// };

// exports.updateStagiaire = async (req, res, next) => {
//   try {
//     const stagiaire = await Stagiaire.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });
//     if (!stagiaire) return res.status(404).json({ error: "Stagiaire not found" });
//     res.json(stagiaire);
//   } catch (err) {
//     next(err);
//   }
// };


// // Route pour la suppression temporaire (soft delete)
// exports.softDelete = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const updatedStagiaire = await Stagiaire.findByIdAndUpdate(
//       id,
//       { 
//         isDeleted: true, 
//         deletedAt: new Date() 
//       },
//       { new: true }
//     );
    
//     if (!updatedStagiaire) {
//       return res.status(404).json({ message: 'Stagiaire non trouvé' });
//     }
    
//     res.json({ message: 'Stagiaire supprimé temporairement', stagiaire: updatedStagiaire });
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la suppression temporaire', error });
//   }
// };

// // Route pour restaurer un stagiaire
// exports.restore = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const restoredStagiaire = await Stagiaire.findByIdAndUpdate(
//       id,
//       { 
//         isDeleted: false, 
//         deletedAt: null 
//       },
//       { new: true }
//     );
    
//     if (!restoredStagiaire) {
//       return res.status(404).json({ message: 'Stagiaire non trouvé' });
//     }
    
//     res.json({ message: 'Stagiaire restauré avec succès', stagiaire: restoredStagiaire });
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la restauration', error });
//   }
// };

// // Route pour récupérer les stagiaires supprimés
// exports.deleted = async (req, res) => {
//   try {
//     const deletedStagiaires = await Stagiaire.find({ isDeleted: true })
//       .sort({ deletedAt: -1 })
    
//     res.json(deletedStagiaires);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la récupération', error });
//   }
// };

// // Modifier la route existante pour exclure les stagiaires supprimés
// exports.stagiaires = async (req, res) => {
//   try {
//     const { isDeleted = 'false' } = req.query;
    
//     const filter = isDeleted === 'true' ? { isDeleted: true } : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };
    
//     const stagiaires = await Stagiaire.find(filter);
//     res.json(stagiaires);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la récupération', error });
//   }
// };


// exports.deleteStagiaire = async (req, res, next) => {
//   try {
//     const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
//     if (!stagiaire) return res.status(404).json({ error: "Stagiaire not found" });
//     res.json({ message: "Stagiaire deleted successfully" });
//   } catch (err) {
//     next(err);
//   }
// };

// //-----------------------------------------------------------------------------

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
//     if (!encadrant) return res.status(404).json({ error: "Encadrant not found" });
//     res.json(encadrant);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.createManyEncadrants = async (req, res, next) => {
//   try {
//     if (!Array.isArray(req.body)) {
//       return res.status(400).json({ error: "Expected an array of encadrants." });
//     }

//     const validatedEncadrants = [];
//     for (const item of req.body) {
//       const { error, value } = encadrantSchema.validate(item);
//       if (error) {
//         return res.status(400).json({ error: `Validation failed: ${error.details[0].message}` });
//       }
//       validatedEncadrants.push(value);
//     }

//     const insertedEncadrants = await Encadrant.insertMany(validatedEncadrants);
//     res.status(201).json(insertedEncadrants);
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(409).json({ error: "Duplicate key error. An email may already exist." });
//     }
//     next(err);
//   }
// };

const axios = require("axios");
const mongoose = require("mongoose");
const Stagiaire = require('../database/models/Stagiaire');
const stagiaireSchema = require('../validations/stagiaireValidation');
const Encadrant = require('../database/models/Encadrant');
const encadrantSchema = require('../validations/encadrantValidation');

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
    if (!stagiaire) return res.status(404).json({ error: "Stagiaire non trouvé." });
    res.json(stagiaire);
  } catch (err) {
    next(err);
  }
};

exports.createStagiaire = async (req, res, next) => {
  try {
    const { error, value } = stagiaireSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      _id,
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
      commentaires,
      documents
    } = value;

    if (!encadrantId) {
      return res.status(400).json({ error: "L'identifiant de l'encadrant est requis." });
    }

    const encadrant = await Encadrant.findById(encadrantId).select("email");
    if (!encadrant) {
      return res.status(404).json({ error: "Aucun encadrant trouvé avec cet identifiant." });
    }

    const encadrantEmail = encadrant.email;

    const newStagiaire = new Stagiaire({
      _id,
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
      status: "En attente",
      conventionValidee: false,
      documents,
      commentaires,
    });

    await newStagiaire.save();

    try {
      await axios.post(
        "http://localhost:3030/api/notify",
        {
          encadrantId,
          encadrantEmail,
          stagiaireName: `${nom} ${prenom}`,
          stagiaireEmail: email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (notifyErr) {
      console.error("[createStagiaire] Échec de la notification :", notifyErr.message || notifyErr.toString());
    }

    return res.status(201).json(newStagiaire);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ error: "Cet e-mail existe déjà." });
    }
    next(err);
  }
};

exports.updateStagiaire = async (req, res, next) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!stagiaire) return res.status(404).json({ error: "Stagiaire non trouvé." });
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
      return res.status(404).json({ message: 'Stagiaire non trouvé.' });
    }

    res.json({ message: 'Stagiaire supprimé temporairement.', stagiaire: updatedStagiaire });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression temporaire.', error });
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
      return res.status(404).json({ message: 'Stagiaire non trouvé.' });
    }

    res.json({ message: 'Stagiaire restauré avec succès.', stagiaire: restoredStagiaire });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la restauration.', error });
  }
};

exports.deleted = async (req, res) => {
  try {
    const deletedStagiaires = await Stagiaire.find({ isDeleted: true }).sort({ deletedAt: -1 });
    res.json(deletedStagiaires);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des stagiaires supprimés.', error });
  }
};

exports.stagiaires = async (req, res) => {
  try {
    const { isDeleted = 'false' } = req.query;
    const filter = isDeleted === 'true'
      ? { isDeleted: true }
      : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };

    const stagiaires = await Stagiaire.find(filter);
    res.json(stagiaires);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des stagiaires.', error });
  }
};

exports.deleteStagiaire = async (req, res, next) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
    if (!stagiaire) return res.status(404).json({ error: "Stagiaire non trouvé." });
    res.json({ message: "Stagiaire supprimé définitivement." });
  } catch (err) {
    next(err);
  }
};

// ----------------- Encadrants -----------------

exports.getAllEncadrants = async (req, res, next) => {
  try {
    const encadrant = await Encadrant.find();
    res.json(encadrant);
  } catch (err) {
    next(err);
  }
};

exports.getEncadrantById = async (req, res, next) => {
  try {
    const encadrant = await Encadrant.findById(req.params.id);
    if (!encadrant) return res.status(404).json({ error: "Encadrant non trouvé." });
    res.json(encadrant);
  } catch (err) {
    next(err);
  }
};

exports.createManyEncadrants = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Une liste d'encadrants est attendue." });
    }

    const validatedEncadrants = [];
    for (const item of req.body) {
      const { error, value } = encadrantSchema.validate(item);
      if (error) {
        return res.status(400).json({ error: `Échec de la validation : ${error.details[0].message}` });
      }
      validatedEncadrants.push(value);
    }

    const insertedEncadrants = await Encadrant.insertMany(validatedEncadrants);
    res.status(201).json(insertedEncadrants);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Doublon détecté. Un e-mail existe peut-être déjà." });
    }
    next(err);
  }
};
