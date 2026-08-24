const express = require("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    authorizeRoles("buyer"),
    getCart
);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("buyer"),
    addToCart
);

router.delete(
    "/:productId",
    authMiddleware,
    authorizeRoles("buyer"),
    removeFromCart
);

router.delete(
    "/",
    authMiddleware,
    authorizeRoles("buyer"),
    clearCart
);

module.exports = router;