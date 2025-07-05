const express = require('express');
const router = express.Router();
const {
  getAllStagiaires,
  getStagiaireById,
  createStagiaire,
  updateStagiaire,
  deleteStagiaire,
  softDelete,
  restore,
  deleted,
  stagiaires,
  getAllEncadrants,
  getEncadrantById,
  createManyEncadrants,
  getDashboardStats,
  getPendingInterns,
  updateStagiaireStatus,
} = require('../controllers/stagiaireController');

const { authMiddleware } = require('../middlewares/authMiddleware');

// === Stagiaire Routes ===
router.get('/Stagiaires', getAllStagiaires);
router.get('/Stagiaire/:id', getStagiaireById);
router.post('/Stagiaire', createStagiaire);
router.put('/Stagiaire/:id', updateStagiaire);
router.delete('/Stagiaire/:id', deleteStagiaire);

router.patch('/Stagiaire/soft-delete/:id', softDelete);
router.patch('/Stagiaire/restore/:id', restore);
router.get('/Stagiaires/deleted', deleted);
router.get('/Stagiaires/list', stagiaires);

// === Encadrant Routes ===
router.get('/test/Encadrants', getAllEncadrants);
router.get('/test/Encadrant/:id', getEncadrantById);
router.post('/test/Encadrant', createManyEncadrants);

//__________________________________________________________________________ new
router.get("/dashboard/stats", getDashboardStats);
router.get("/stagiaires/en-attente", getPendingInterns);
router.patch("/stagiaire/update-status", updateStagiaireStatus);


module.exports = router;


