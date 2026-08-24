const express = require("express");
const router = express.Router();

const {
    createDelivery,
    getDelivery,
    updateDelivery
} = require("../controllers/deliveryController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "seller"),
    createDelivery
);

router.get(
    "/:orderId",
    authMiddleware,
    getDelivery
);

router.put(
    "/:orderId",
    authMiddleware,
    authorizeRoles("admin", "seller"),
    updateDelivery
);

module.exports = router;