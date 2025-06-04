const Joi = require('joi');

const encadrantSchema = Joi.object({
  _id: Joi.string().required(),
  nom: Joi.string().required().min(2).max(100),
  prenom: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  specialite: Joi.string().required(),
  stagiairesEncadresIds:Joi.required(),
});

module.exports = encadrantSchema;