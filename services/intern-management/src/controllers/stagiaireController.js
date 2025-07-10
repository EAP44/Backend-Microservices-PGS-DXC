const axios = require("axios");
const FormData = require("form-data");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Readable } = require("stream");
const Stagiaire = require("../database/models/Stagiaire");
const Encadrant = require("../database/models/Encadrant");
const encadrantSchema = require("../validations/encadrantValidation");

const generateStagiaireId = async () => {
  const count = await Stagiaire.countDocuments();
  return `S${count + 1}`;
};

// ==================== GET All Stagiaires ====================
exports.getAllStagiaires = async (req, res, next) => {
  try {
    const stagiaires = await Stagiaire.find();
    res.json(stagiaires);
  } catch (err) {
    next(err);
  }
};

// ==================== GET Stagiaire by ID ====================
exports.getStagiaireById = async (req, res, next) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id);
    if (!stagiaire)
      return res.status(404).json({ error: "Stagiaire non trouvé." });
    res.json(stagiaire);
  } catch (err) {
    next(err);
  }
};

// ==================== CREATE Stagiaire ====================
exports.createStagiaire = async (req, res, next) => {
  try {
    const {
      nom,
      prenom,
      email,
      phoneNumber,
      ecole,
      specialite,
      niveau,
      dateDebut,
      dateFin,
      encadrantId,
      sujet = "",
      description = "",
      competences = "",
    } = req.body;

    if (!nom || !prenom || !email || !phoneNumber || !encadrantId) {
      return res.status(400).json({
        error:
          "Nom, prénom, email, numéro de téléphone et encadrant sont requis.",
      });
    }
    const dateDebutClean = new Date((dateDebut || "").trim());
    const dateFinClean = new Date((dateFin || "").trim());
    const encadrant = await Encadrant.findById(encadrantId).select("email");
    if (!encadrant) {
      return res
        .status(404)
        .json({ error: "Aucun encadrant trouvé avec cet identifiant." });
    }
    const stagiaireId = await generateStagiaireId();
    const uploadedFiles = {};
    const requiredFiles = ["CV", "ConventionDeStage"];
    const optionalFiles = ["DemandeDeStage"];
    const fileKeys = [...requiredFiles, ...optionalFiles];

    let allFilesUploaded = true;

    for (const key of fileKeys) {
      const file = req.files?.[key]?.[0];

      if (!file || !file.buffer) {
        if (requiredFiles.includes(key)) {
          return res.status(400).json({ error: `Le fichier ${key} est requis.` });
        } else {
          allFilesUploaded = false;
          continue;
        }
      }

      const form = new FormData();
      form.append("file", Readable.from(file.buffer), {
        filename: `${key}_${nom}_${prenom}.pdf`,
        contentType: file.mimetype,
      });

      form.append(
        "metadata",
        JSON.stringify({
          stagiaireId,
          uploadedBy: "rh",
          tags: [key.toLowerCase(), "pdf"],
          categorie: key,
        })
      );

      try {
        const uploadRes = await axios.post(
          "http://file-service:3000/api/files/upload",
          form,
          { headers: form.getHeaders() }
        );
        uploadedFiles[key] = uploadRes.data.id;
      } catch (uploadErr) {
        return res
          .status(500)
          .json({ error: `Échec du téléversement de ${key}` });
      }
    }

    const status = requiredFiles.every((k) => uploadedFiles[k])
      ? "Complète"
      : "En attente";

    const newStagiaire = new Stagiaire({
      _id: stagiaireId,
      nom,
      prenom,
      email,
      phoneNumber,
      ecole,
      specialite,
      niveau,
      dateDebut: dateDebutClean,
      dateFin: dateFinClean,
      sujet,
      description,
      competences,
      encadrantId,
      status,
      conventionValidee: false,
      isDeleted: false,
      deletedAt: null,
      commentaires: [],
      documents: {
        cv: uploadedFiles.CV,
        conventionDeStage: uploadedFiles.ConventionDeStage,
        demandeDeStage: uploadedFiles.DemandeDeStage || null,
      },
    });

    await newStagiaire.save();

    try {
      await axios.post("http://notification-service:3000/api/notify", {
        encadrantId,
        encadrantEmail: encadrant.email,
        stagiaireName: `${nom} ${prenom}`,
        stagiaireEmail: email,
      });
    } catch (notifyErr) {
      console.error("[Erreur notification encadrant]", notifyErr.message);
    }

    return res.status(201).json({
      message: "Stagiaire créé avec succès.",
      stagiaire: newStagiaire,
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({ error: "Cet e-mail existe déjà." });
    }
    next(err);
  }
};

// ==================== UPDATE Stagiaire ====================
// Fonction helper pour supprimer un fichier sur le service de fichiers
async function deleteFileOnService(fileId) {
  try {
    await axios.delete(`http://file-service:3000/api/files/${fileId}`);
  } catch (err) {
    console.warn(`Échec suppression fichier ${fileId} sur file-service :`, err.message);
    // On ne bloque pas l'update si suppression échoue, mais log l'erreur
  }
}
exports.updateStagiaire = async (req, res, next) => {
  try {
    const stagiaireId = req.params.id;
    const stagiaire = await Stagiaire.findById(stagiaireId);

    if (!stagiaire) {
      return res.status(404).json({ error: "Stagiaire non trouvé." });
    }

    const updatedFields = req.body;
    const uploadedFiles = {};
    const fileKeys = ["CV", "ConventionDeStage", "DemandeDeStage"];

    for (const key of fileKeys) {
      if (req.files && req.files[key] && req.files[key][0]) {
        const file = req.files[key][0];

        // Supprimer ancien fichier si existant
        let oldFileId;
        switch (key) {
          case "CV":
            oldFileId = stagiaire.documents.cv;
            break;
          case "ConventionDeStage":
            oldFileId = stagiaire.documents.conventionDeStage;
            break;
          case "DemandeDeStage":
            oldFileId = stagiaire.documents.demandeDeStage;
            break;
        }
        if (oldFileId) {
          await deleteFileOnService(oldFileId);
        }

        // Préparer FormData pour nouvel upload
        const form = new FormData();
        form.append("file", file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
        form.append(
          "metadata",
          JSON.stringify({
            stagiaireId,
            uploadedBy: "rh",
            tags: [key.toLowerCase(), "pdf"],
          })
        );

        try {
          const uploadRes = await axios.post(
            "http://file-service:3000/api/files/upload",
            form,
            {
              headers: form.getHeaders(),
            }
          );
          uploadedFiles[key] = uploadRes.data.id;
        } catch (uploadErr) {
          return res
            .status(500)
            .json({ error: `Échec du téléversement de ${key}` });
        }
      }
    }

    // Mise à jour des documents
    if (Object.keys(uploadedFiles).length > 0) {
      stagiaire.documents = {
        ...stagiaire.documents,
        cv: uploadedFiles.CV || stagiaire.documents.cv,
        conventionDeStage: uploadedFiles.ConventionDeStage || stagiaire.documents.conventionDeStage,
        demandeDeStage: uploadedFiles.DemandeDeStage || stagiaire.documents.demandeDeStage,
      };
    }

    // Mise à jour des autres champs
    Object.keys(updatedFields).forEach((key) => {
      if (key in stagiaire) {
        stagiaire[key] = updatedFields[key];
      }
    });

    await stagiaire.save();

    res.json({
      message: "Stagiaire mis à jour avec succès.",
      stagiaire,
    });
  } catch (err) {
    next(err);
  }
};

// ==================== SOFT DELETE ====================
exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Stagiaire.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Stagiaire non trouvé." });
    res.json({
      message: "Stagiaire supprimé temporairement.",
      stagiaire: updated,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression.", error: err });
  }
};

// ==================== RESTORE ====================
exports.restore = async (req, res) => {
  try {
    const { id } = req.params;
    const restored = await Stagiaire.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!restored)
      return res.status(404).json({ message: "Stagiaire non trouvé." });
    res.json({
      message: "Stagiaire restauré avec succès.",
      stagiaire: restored,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la restauration.", error: err });
  }
};

// ==================== GET DELETED ====================
exports.deleted = async (req, res) => {
  try {
    const deleted = await Stagiaire.find({ isDeleted: true }).sort({
      deletedAt: -1,
    });
    res.json(deleted);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur récupération stagiaires supprimés.",
        error: err,
      });
  }
};

// ==================== GET STAGIAIRES (by isDeleted) ====================
exports.stagiaires = async (req, res) => {
  try {
    const { isDeleted = "false" } = req.query;
    const filter =
      isDeleted === "true"
        ? { isDeleted: true }
        : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };
    const stagiaires = await Stagiaire.find(filter);
    res.json(stagiaires);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur récupération stagiaires.", error: err });
  }
};

// ==================== DELETE DEFINITIF ====================
exports.deleteStagiaire = async (req, res, next) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
    if (!stagiaire)
      return res.status(404).json({ error: "Stagiaire non trouvé." });
    res.json({ message: "Stagiaire supprimé définitivement." });
  } catch (err) {
    next(err);
  }
};

// ==================== GET All Encadrants ====================
exports.getAllEncadrants = async (req, res, next) => {
  try {
    const encadrants = await Encadrant.find();
    res.json(encadrants);
  } catch (err) {
    next(err);
  }
};

// ==================== GET Encadrant by ID ====================
exports.getEncadrantById = async (req, res, next) => {
  try {
    const encadrant = await Encadrant.findById(req.params.id);
    if (!encadrant)
      return res.status(404).json({ error: "Encadrant non trouvé." });
    res.json(encadrant);
  } catch (err) {
    next(err);
  }
};

// ==================== CREATE Many Encadrants ====================
exports.createManyEncadrants = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ error: "Une liste d'encadrants est attendue." });
    }

    const validated = [];
    for (const item of req.body) {
      const { error, value } = encadrantSchema.validate(item);
      if (error) {
        return res
          .status(400)
          .json({ error: `Validation échouée : ${error.details[0].message}` });
      }
      if (!value.statut) value.statut = "actif";
      if (value.disponible === undefined) value.disponible = true;
      validated.push(value);
    }

    const inserted = await Encadrant.insertMany(validated);
    res.status(201).json(inserted);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Doublon détecté sur l'email." });
    }
    next(err);
  }
};

// ==================== DELETE All Encadrants ====================
exports.deleteAllEncadrants = async (req, res, next) => {
  try {
    const result = await Encadrant.deleteMany({});
    res
      .status(200)
      .json({ message: `${result.deletedCount} encadrants supprimés.` });
  } catch (err) {
    next(err);
  }
};

// ==================== Dashboard Stats ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalInterns = await Stagiaire.countDocuments({
      isDeleted: { $ne: true },
    });
    const totalSupervisors = await Encadrant.countDocuments();
    const activeInternships = await Stagiaire.countDocuments({
      status: "Complète",
      isDeleted: { $ne: true },
    });
    const pendingInterns = await Stagiaire.countDocuments({
      status: "En attente",
      isDeleted: { $ne: true },
    });

    res.json({
      totalInterns,
      totalSupervisors,
      activeInternships,
      pendingInterns,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération stats.", error: err });
  }
};

// ==================== Get Pending Interns ====================
exports.getPendingInterns = async (req, res, next) => {
  try {
    const interns = await Stagiaire.find({
      status: "En attente",
      isDeleted: { $ne: true },
    });
    res.json(interns);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur récupération stagiaires en attente.",
        error: err,
      });
  }
};

// ==================== Update Stagiaire Status ====================
exports.updateStagiaireStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    if (!id) return res.status(400).json({ error: "ID stagiaire requis." });

    if (!["Complète", "En attente", "Annulé"].includes(status)) {
      return res.status(400).json({ error: "Statut invalide." });
    }

    const updated = await Stagiaire.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Stagiaire non trouvé." });

    res.json({ message: "Statut mis à jour.", stagiaire: updated });
  } catch (err) {
    next(err);
  }
};

// ==================== download Stats PDF ====================

exports.downloadStatsPDF = async (req, res) => {
  try {
    const totalInterns = await Stagiaire.countDocuments({ isDeleted: { $ne: true } });
    const totalSupervisors = await Encadrant.countDocuments();
    const activeInternships = await Stagiaire.countDocuments({ status: "Complète", isDeleted: { $ne: true } });
    const pendingInterns = await Stagiaire.countDocuments({ status: "En attente", isDeleted: { $ne: true } });
    const stagiaires = await Stagiaire.find();
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Disposition", "attachment; filename=dashboard-stats.pdf");
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Rapport des Stagiaires et Statistiques", { align: "center" }).moveDown();

    doc.fontSize(14).text(`Total des stagiaires : ${totalInterns}`);
    doc.text(`Total des encadrants : ${totalSupervisors}`);
    doc.text(`Stages complétés : ${activeInternships}`);
    doc.text(`Stagiaires en attente : ${pendingInterns}`);
    doc.moveDown();

    doc.fontSize(16).text("Liste des Stagiaires", { underline: true }).moveDown();

    stagiaires.forEach((stagiaire, index) => {
      doc.fontSize(12).text(
        `${index + 1}. Nom: ${stagiaire.nom || "-"}, Prénom: ${stagiaire.prenom || "-"}, Email: ${stagiaire.email || "-"}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Erreur lors de la génération du PDF.", error: err });
  }
};

// ==================== download Stats Excel ====================

exports.downloadStatsExcel = async (req, res) => {
  try {
    const totalInterns = await Stagiaire.countDocuments({ isDeleted: { $ne: true } });
    const totalSupervisors = await Encadrant.countDocuments();
    const activeInternships = await Stagiaire.countDocuments({ status: "Complète", isDeleted: { $ne: true } });
    const pendingInterns = await Stagiaire.countDocuments({ status: "En attente", isDeleted: { $ne: true } });
    const stagiaires = await Stagiaire.find();
    const workbook = new ExcelJS.Workbook();
    const statsSheet = workbook.addWorksheet("Statistiques");
    const stagiairesSheet = workbook.addWorksheet("Stagiaires");

    statsSheet.columns = [
      { header: "Statistique", key: "label", width: 30 },
      { header: "Valeur", key: "value", width: 15 },
    ];

    statsSheet.addRows([
      { label: "Total des stagiaires", value: totalInterns },
      { label: "Total des encadrants", value: totalSupervisors },
      { label: "Stages complétés", value: activeInternships },
      { label: "Stagiaires en attente", value: pendingInterns },
    ]);

    stagiairesSheet.columns = [
      { header: "Nom", key: "nom", width: 20 },
      { header: "Prénom", key: "prenom", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Statut", key: "status", width: 15 },
    ];

    stagiaires.forEach((stagiaire) => {
      stagiairesSheet.addRow({
        nom: stagiaire.nom || "-",
        prenom: stagiaire.prenom || "-",
        email: stagiaire.email || "-",
        status: stagiaire.status || "-",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=dashboard-stats.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ message: "Erreur lors de la génération du fichier Excel.", error: err });
  }
};