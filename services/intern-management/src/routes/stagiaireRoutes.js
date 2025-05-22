const express = require('express');
const router = express.Router();
const {
  getAllStagiaires,
  getStagiaireById,
  createStagiaire,
  updateStagiaire,
  deleteStagiaire,
} = require('../controllers/stagiaireController');

router.get('/', getAllStagiaires);
router.get('/:id', getStagiaireById);
router.post('/', createStagiaire);
router.put('/:id', updateStagiaire);
router.delete('/:id', deleteStagiaire);

module.exports = router;

