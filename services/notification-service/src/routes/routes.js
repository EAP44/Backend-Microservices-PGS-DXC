const express = require("express");
const auth = require("../middleware/auth");
const { subscribe, sendNotification } = require("../controllers/notificationController");

const router = express.Router();

router.post("/subscribe", auth, subscribe);
router.post("/send", auth, sendNotification);

module.exports = router;
