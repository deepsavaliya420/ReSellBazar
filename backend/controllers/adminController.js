const User = require("../models/User");
const Product = require("../models/Product");

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get users",
            error: error.message
        });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                role: req.body.role
            },
            {
                new: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User role updated",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update role",
            error: error.message
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("seller", "name email")
            .populate("category", "name");

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get products",
            error: error.message
        });
    }
};

const updateProductStatus = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new: true
            }
        )
            .populate("seller", "name email")
            .populate("category", "name");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product status updated",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update product status",
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    updateUserRole,
    getAllProducts,
    updateProductStatus
};