const express = require('express');
const router = express.Router();
const {
  getAllStagiaires,
  getStagiaireById,
  createStagiaire,
  updateStagiaire,
  deleteStagiaire,

  getAllEncadrants,
  getEncadrantById,
  createManyEncadrants,
} = require('../controllers/stagiaireController');
const { authMiddleware } = require('../middlewares/authMiddleware')

router.get('/Stagiaires', authMiddleware, getAllStagiaires);
router.get('/Stagiaire/:id', authMiddleware, getStagiaireById);
router.post('/Stagiaire', createStagiaire);
router.put('/Stagiaire/:id', authMiddleware, updateStagiaire);
router.delete('/Stagiaire/:id', deleteStagiaire);

//---------------------------------------------------------------------------- for test
router.get('/test/Encadrants', getAllEncadrants);
router.get('/test/Encadrant/:id', getEncadrantById);
router.post('/test/Encadrant', createManyEncadrants);
//---------------------------------------------------------------------------- for test

module.exports = router;

