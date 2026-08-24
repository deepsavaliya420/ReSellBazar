const express = require("express");

const {
    getProfile,
    updateProfile,
    getAllUsers,
    updateUserRole
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.get("/all", protect, authorize("admin"), getAllUsers);

router.put(
    "/role/:id",
    protect,
    authorize("admin"),
    updateUserRole
);

module.exports = router;