const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    authorizeRoles("buyer"),
    createOrder
);

router.get(
    "/my",
    authMiddleware,
    authorizeRoles("buyer"),
    getMyOrders
);

router.get(
    "/all",
    authMiddleware,
    authorizeRoles("admin"),
    getAllOrders
);

router.put(
    "/:id/status",
    authMiddleware,
    authorizeRoles("admin", "seller"),
    updateOrderStatus
);

module.exports = router;