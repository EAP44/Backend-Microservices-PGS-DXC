const Joi = require('joi');

const stagiaireSchema = Joi.object({
  nom: Joi.string().required().min(2).max(100),
  prenom: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
});

module.exports = stagiaireSchema;
