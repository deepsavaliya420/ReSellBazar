const Cart = require("../models/Cart");

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            buyer: req.user.id
        }).populate("items.product");

        if (!cart) {
            cart = await Cart.create({
                buyer: req.user.id,
                items: []
            });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get cart",
            error: error.message
        });
    }
};

const addToCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            buyer: req.user.id
        });

        if (!cart) {
            cart = await Cart.create({
                buyer: req.user.id,
                items: []
            });
        }

        const existing = cart.items.find(
            item => item.product.toString() === req.body.productId
        );

        if (existing) {
            existing.quantity += Number(req.body.quantity || 1);
        } else {
            cart.items.push({
                product: req.body.productId,
                quantity: req.body.quantity || 1
            });
        }

        await cart.save();

        res.json({
            message: "Product added to cart",
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            buyer: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();

        res.json({
            message: "Product removed from cart",
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove product",
            error: error.message
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            buyer: req.user.id
        });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({
            message: "Cart cleared"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to clear cart",
            error: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
};