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
    if (!stagiaire) return res.status(404).json({ error: "Stagiaire not found" });
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
    } = value;

    if (!encadrantId) {
      return res.status(400).json({ error: "encadrantId est requis." });
    }
    const encadrant = await Encadrant.findById(encadrantId).select("email");
    if (!encadrant) {
      return res
        .status(404)
        .json({ error: "Aucun encadrant trouvé avec cet ID." });
    }
    const encadrantEmail = encadrant.email;

    const newStagiaire = new Stagiaire({
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
      console.error(
        "[createStagiaire] La requête POST /api/notify a échoué:",
        notifyErr.message || notifyErr.toString()
      );
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
    if (!stagiaire) return res.status(404).json({ error: "Stagiaire not found" });
    res.json(stagiaire);
  } catch (err) {
    next(err);
  }
};

exports.deleteStagiaire = async (req, res, next) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
    if (!stagiaire) return res.status(404).json({ error: "Stagiaire not found" });
    res.json({ message: "Stagiaire deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//-----------------------------------------------------------------------------

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
    if (!encadrant) return res.status(404).json({ error: "Encadrant not found" });
    res.json(encadrant);
  } catch (err) {
    next(err);
  }
};

exports.createManyEncadrants = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Expected an array of encadrants." });
    }

    const validatedEncadrants = [];
    for (const item of req.body) {
      const { error, value } = encadrantSchema.validate(item);
      if (error) {
        return res.status(400).json({ error: `Validation failed: ${error.details[0].message}` });
      }
      validatedEncadrants.push(value);
    }

    const insertedEncadrants = await Encadrant.insertMany(validatedEncadrants);
    res.status(201).json(insertedEncadrants);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate key error. An email may already exist." });
    }
    next(err);
  }
};

