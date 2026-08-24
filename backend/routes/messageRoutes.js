const express = require("express");
const router = express.Router();

const {
    sendMessage,
    getMessages
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", sendMessage);
router.get("/:userId", getMessages);

module.exports = router;