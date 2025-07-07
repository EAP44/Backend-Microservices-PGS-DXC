const Joi = require("joi");

const encadrantSchema = Joi.object({
  _id: Joi.string().required(),
  nom: Joi.string().trim().required(),
  prenom: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  specialite: Joi.string().required(),
  stagiairesEncadresIds: Joi.array().items(Joi.string()),

  departement: Joi.string().required(),
  statut: Joi.string().valid("actif", "inactif").default("actif"),
  disponible: Joi.boolean().default(true),
});


module.exports = encadrantSchema;