const mongoose = require('mongoose');
const DocumentMetadata = require('../models/DocumentMetadata');
const { Readable } = require('stream');

const bucketName = 'uploads';

// ✅ Upload de fichier
exports.uploadFile = async (req, res) => {
  try {
    const { metadata } = req.body;
    const parsed = JSON.parse(metadata);
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'Aucun fichier fourni.' });
    if (!parsed.stagiaireId || !parsed.categorie) {
      return res.status(400).json({ message: 'stagiaireId et categorie sont requis.' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName,
    });

    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    const fileId = uploadStream.id;
    const readStream = Readable.from(file.buffer);
    readStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Erreur d’upload :', error);
      res.status(500).json({ message: 'Erreur durant l’upload.' });
    });

    uploadStream.on('finish', async () => {
      const doc = new DocumentMetadata({
        stagiaireId: parsed.stagiaireId,
        nomFichier: file.originalname,
        type: file.mimetype,
        taille: file.size,
        cheminStorage: fileId,
        uploadedBy: parsed.uploadedBy,
        categorie: parsed.categorie,
        tags: parsed.tags || [],
      });

      await doc.save();
      res.status(201).json({ message: 'Fichier uploadé avec succès.', id: doc._id  });
    });
  } catch (err) {
    console.error('Erreur upload :', err.message);
    return res.status(400).json({ error: 'Erreur de parsing ou fichier manquant.' });
  }
};

// ✅ Lister les fichiers d’un stagiaire
exports.getFilesByStagiaire = async (req, res) => {
  try {
    const { stagiaireId } = req.params;

    const files = await DocumentMetadata.find({ stagiaireId });

    if (!files.length) return res.status(404).json({ message: 'Aucun fichier trouvé.' });

    res.status(200).json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ✅ Télécharger un fichier par son ID (metadataId)
exports.downloadFileById = async (req, res) => {
  try {
    const metadata = await DocumentMetadata.findById(req.params.id);

    if (!metadata) return res.status(404).json({ message: 'Fichier non trouvé.' });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName });

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(metadata.cheminStorage));

    res.set('Content-Type', metadata.type);
    res.set('Content-Disposition', `attachment; filename="${metadata.nomFichier}"`);

    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('Erreur de téléchargement :', err);
      res.status(500).json({ message: 'Erreur pendant le téléchargement' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ✅ Télécharger un fichier par stagiaireId + categorie
exports.downloadFileByCategorie = async (req, res) => {
  try {
    const { stagiaireId, categorie } = req.params;

    const metadata = await DocumentMetadata.findOne({
      stagiaireId,
      categorie,
    }).sort({ uploadDate: -1 });

    if (!metadata) return res.status(404).json({ message: 'Fichier non trouvé.' });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName });

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(metadata.cheminStorage));

    res.set('Content-Type', metadata.type);
    res.set('Content-Disposition', `attachment; filename="${metadata.nomFichier}"`);

    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('Erreur de téléchargement :', err);
      res.status(500).json({ message: 'Erreur pendant le téléchargement' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ✅ Supprimer tous les fichiers et métadonnées (nettoyage total)
exports.deleteAllFiles = async (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName,
    });

    // 1. Récupérer tous les fichiers metadata
    const allFiles = await DocumentMetadata.find();

    // 2. Supprimer chaque fichier dans GridFS
    for (const file of allFiles) {
      try {
        await bucket.delete(new mongoose.Types.ObjectId(file.cheminStorage));
      } catch (err) {
        console.warn(`Erreur suppression fichier GridFS ${file.cheminStorage} : ${err.message}`);
      }
    }

    // 3. Supprimer toutes les métadonnées
    await DocumentMetadata.deleteMany();

    res.status(200).json({ message: 'Tous les fichiers et métadonnées ont été supprimés.' });
  } catch (err) {
    console.error('Erreur suppression globale :', err.message);
    res.status(500).json({ message: 'Erreur serveur pendant la suppression globale.' });
  }
};
