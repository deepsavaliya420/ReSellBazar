const Category = require("../models/Category");

const createCategory = async (req, res) => {
    try {
        const category = await Category.create({
            name: req.body.name,
            description: req.body.description
        });

        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create category",
            error: error.message
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            status: "active"
        });

        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get categories",
            error: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);

        res.json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete category",
            error: error.message
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    deleteCategory
};