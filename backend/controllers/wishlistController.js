const Wishlist = require("../models/Wishlist");

const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({
            buyer: req.user.id
        }).populate("products");

        if (!wishlist) {
            wishlist = await Wishlist.create({
                buyer: req.user.id,
                products: []
            });
        }

        res.json(wishlist);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get wishlist",
            error: error.message
        });
    }
};

const addWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({
            buyer: req.user.id
        });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                buyer: req.user.id,
                products: []
            });
        }

        if (!wishlist.products.includes(req.body.productId)) {
            wishlist.products.push(req.body.productId);
        }

        await wishlist.save();

        res.json({
            message: "Product added to wishlist",
            wishlist
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add wishlist",
            error: error.message
        });
    }
};

const removeWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            buyer: req.user.id
        });

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found"
            });
        }

        wishlist.products = wishlist.products.filter(
            id => id.toString() !== req.params.productId
        );

        await wishlist.save();

        res.json({
            message: "Product removed from wishlist"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove product",
            error: error.message
        });
    }
};

module.exports = {
    getWishlist,
    addWishlist,
    removeWishlist
};