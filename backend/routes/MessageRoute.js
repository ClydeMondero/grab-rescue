const express = require("express");
const { sendNotification } = require("../controllers/MessageController");
const router = express.Router();

// Route for creating a log entry
router.post("/send", sendNotification);

module.exports = router;
