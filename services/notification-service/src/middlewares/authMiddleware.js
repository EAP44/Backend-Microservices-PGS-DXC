const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECTER_KEY = process.env.SECTER_KEY;

const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

//   const token = authHeader.split(' ')[1]; 
//   if (!token) return res.status(401).json({ message: 'Token manquant' });

//   jwt.verify(token, SECTER_KEY, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Token invalide' });

//     if (!user.roles || !user.roles.includes('encadrant')) {
//       return res.status(403).json({ message: 'Accès refusé : rôle encadrant requis' });
//     }

    req.user = 'user'; // ROLLBACK
    next();
//   });
};

module.exports = authMiddleware;
