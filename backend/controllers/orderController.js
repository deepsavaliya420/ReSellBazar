const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const orderItems = [];

        for (const item of req.body.items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient quantity for ${product.name}`
                });
            }

            orderItems.push({
                product: product._id,
                seller: product.seller,
                quantity: item.quantity,
                price: product.price
            });

            product.quantity -= item.quantity;
            await product.save();
        }

        const totalAmount = orderItems.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            buyer: req.user.id,
            items: orderItems,
            address: req.body.address,
            totalAmount,
            paymentMethod: req.body.paymentMethod || "cod"
        });

        res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            buyer: req.user.id
        })
        .populate("items.product")
        .populate("address");

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get orders",
            error: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("buyer", "name email")
            .populate("items.product")
            .populate("address");

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get orders",
            error: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderStatus: req.body.status
            },
            {
                new: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update order",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};