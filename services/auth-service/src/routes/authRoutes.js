const express = require('express');
const { login, logout, forgotPassword, addManyUsers, getProfile,cleanDatabase,changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/login', login);

router.post('/logout', protect, logout);

router.post('/forgot-password', forgotPassword);

router.post('/addManyUsers', addManyUsers);

router.get("/user/profile", getProfile);

router.put('/user/change-password', changePassword);

router.delete('/dev/clean-db', cleanDatabase);


module.exports = router;
