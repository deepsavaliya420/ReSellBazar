const Review = require("../models/Review");

const addReview = async (req, res) => {
    try {
        const review = await Review.create({
            buyer: req.user.id,
            product: req.body.product,
            rating: req.body.rating,
            comment: req.body.comment
        });

        res.status(201).json({
            message: "Review added successfully",
            review
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add review",
            error: error.message
        });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId
        })
        .populate("buyer", "name");

        res.json(reviews);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get reviews",
            error: error.message
        });
    }
};

module.exports = {
    addReview,
    getReviews
};