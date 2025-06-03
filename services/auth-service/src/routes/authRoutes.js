const express = require('express');
const { login, logout, forgotPassword, addManyUsers } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/login', login);

router.post('/logout', protect, logout);

router.post('/forgot-password', forgotPassword);

router.post('/addManyUsers', addManyUsers);

module.exports = router;
