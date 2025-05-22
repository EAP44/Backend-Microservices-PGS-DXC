const Joi = require('joi');

const documentSchema = Joi.object({
  titre: Joi.string().required(),
  fichier: Joi.string().uri().required()
});

const commentaireSchema = Joi.object({
  date: Joi.date().required(),
  commentaire: Joi.string().required(),
  auteur: Joi.string().required()
});

const stagiaireSchema = Joi.object({
  nom: Joi.string().required().min(2).max(100),
  prenom: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  ecole: Joi.string().required(),
  specialite: Joi.string().required(),
  niveau: Joi.string().required(),
  dateDebut: Joi.date().required(),
  dateFin: Joi.date().greater(Joi.ref('dateDebut')).required(),
  encadrantId: Joi.string().uuid().required(),
  status: Joi.string().valid('En attente', 'En cours', 'Terminé', 'Annulé').default('En attente'),
  conventionValidee: Joi.boolean().default(false),
  documents: Joi.array().items(documentSchema).default([]),
  commentaires: Joi.array().items(commentaireSchema).default([]),
});

module.exports = stagiaireSchema;
