const Product = require("../models/Product");

const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            seller: req.user.id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            condition: req.body.condition,
            quantity: req.body.quantity,
            images: req.body.images || []
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            status: "approved"
        })
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

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("seller", "name email")
            .populate("category", "name");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get product",
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                seller: req.user.id
            },
            req.body,
            {
                new: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found or unauthorized"
            });
        }

        res.json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            seller: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or unauthorized"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};