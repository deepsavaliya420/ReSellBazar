const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("seller"),
    createProduct
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("seller"),
    updateProduct
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("seller"),
    deleteProduct
);

module.exports = router;