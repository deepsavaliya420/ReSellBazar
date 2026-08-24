const express = require("express");
const router = express.Router();

const {
    createCategory,
    getCategories,
    deleteCategory
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", getCategories);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createCategory
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteCategory
);

module.exports = router;