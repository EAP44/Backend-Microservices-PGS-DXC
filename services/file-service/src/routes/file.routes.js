const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/file.controller');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload fichier
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Lister fichiers d’un stagiaire
router.get('/stagiaires/:stagiaireId/files', fileController.getFilesByStagiaire);

// Télécharger fichier par ID
router.get('/download/:id', fileController.downloadFileById);

// Télécharger fichier par stagiaireId et catégorie
router.get('/stagiaires/:stagiaireId/download-categorie/:categorie', fileController.downloadFileByCategorie);

router.delete('/clear-all', fileController.deleteAllFiles);


module.exports = router;