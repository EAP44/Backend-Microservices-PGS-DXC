const express = require('express');
const router = express.Router();
const { publishNotification , encadrantNotification } = require('../controllers/NotificationsController');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post('/notify', publishNotification);
router.get('/notifications', authMiddleware , encadrantNotification );

module.exports = router;
