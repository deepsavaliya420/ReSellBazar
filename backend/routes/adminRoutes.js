const express = require("express");
const router = express.Router();

const {
    getUsers,
    updateUserRole,
    updateProductStatus
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.get("/users", getUsers);

router.put("/users/:id/role", updateUserRole);

router.put("/products/:id/status", updateProductStatus);

module.exports = router;