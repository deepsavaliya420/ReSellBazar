const express = require("express");
const router = express.Router();

const {
    createPayment,
    getPayment
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", createPayment);
router.get("/:orderId", getPayment);

module.exports = router;