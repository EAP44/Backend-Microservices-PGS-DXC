const Stagiaire = require('../database/models/Stagiaire');
const stagiaireSchema = require('../validations/stagiaireValidation');

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
    if (error) return res.status(400).json({ error: error.details[0].message });

    const newStagiaire = new Stagiaire(value);
    await newStagiaire.save();
    res.status(201).json(newStagiaire);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already exists." });
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
