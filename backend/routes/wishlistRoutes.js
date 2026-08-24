const express = require("express");
const router = express.Router();

const {
    getWishlist,
    addWishlist,
    removeWishlist
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    authorizeRoles("buyer"),
    getWishlist
);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("buyer"),
    addWishlist
);

router.delete(
    "/:productId",
    authMiddleware,
    authorizeRoles("buyer"),
    removeWishlist
);

module.exports = router;