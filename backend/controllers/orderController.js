const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const orderItems = [];

        for (const item of req.body.items) {

            const product =
                await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message:
                        `Insufficient quantity for ${product.name}`
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
                total +
                item.price * item.quantity,
            0
        );

        const order = await Order.create({
            buyer: req.user.id,

            items: orderItems,

            address: req.body.address,

            totalAmount,

            paymentMethod:
                req.body.paymentMethod || "cod",

            delivery: {
                courier: "",
                trackingNumber: "",
                estimatedDelivery: null,
                shippedAt: null,
                outForDeliveryAt: null,
                deliveredAt: null,
                deliveryNotes: ""
            }
        });

        res.status(201).json({
            message:
                "Order placed successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to create order",
            error: error.message
        });
    }
};


const getMyOrders = async (req, res) => {
    try {

        const orders =
            await Order.find({
                buyer: req.user.id
            })
                .populate("items.product")
                .populate("address");

        res.json(orders);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to get orders",
            error: error.message
        });
    }
};


const getAllOrders = async (req, res) => {
    try {

        const orders =
            await Order.find()
                .populate(
                    "buyer",
                    "name email mobile"
                )
                .populate("items.product")
                .populate("items.seller", "name email")
                .populate("address");

        res.json(orders);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to get orders",
            error: error.message
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {

        const {
            status
        } = req.body;

        const validStatuses = [
            "placed",
            "confirmed",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ];

        if (
            !validStatuses.includes(status)
        ) {
            return res.status(400).json({
                message:
                    "Invalid order status"
            });
        }

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.orderStatus = status;

        const now = new Date();

        if (
            status === "shipped"
        ) {
            order.delivery.shippedAt =
                now;
        }

        if (
            status === "out_for_delivery"
        ) {
            order.delivery.outForDeliveryAt =
                now;
        }

        if (
            status === "delivered"
        ) {
            order.delivery.deliveredAt =
                now;
        }

        await order.save();

        const updatedOrder =
            await Order.findById(
                order._id
            )
                .populate(
                    "buyer",
                    "name email mobile"
                )
                .populate("items.product")
                .populate(
                    "items.seller",
                    "name email"
                )
                .populate("address");

        res.json({
            message:
                "Order status updated",
            order: updatedOrder
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to update order",
            error: error.message
        });
    }
};


const updateDelivery = async (req, res) => {
    try {

        const {
            courier,
            trackingNumber,
            estimatedDelivery,
            deliveryNotes
        } = req.body;

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (
            courier !== undefined
        ) {
            order.delivery.courier =
                courier;
        }

        if (
            trackingNumber !== undefined
        ) {
            order.delivery.trackingNumber =
                trackingNumber;
        }

        if (
            estimatedDelivery !== undefined
        ) {

            if (
                estimatedDelivery === ""
            ) {
                order.delivery.estimatedDelivery =
                    null;
            } else {

                const deliveryDate =
                    new Date(
                        estimatedDelivery
                    );

                if (
                    isNaN(
                        deliveryDate.getTime()
                    )
                ) {
                    return res.status(400).json({
                        message:
                            "Invalid estimated delivery date"
                    });
                }

                order.delivery.estimatedDelivery =
                    deliveryDate;
            }
        }

        if (
            deliveryNotes !== undefined
        ) {
            order.delivery.deliveryNotes =
                deliveryNotes;
        }

        await order.save();

        const updatedOrder =
            await Order.findById(
                order._id
            )
                .populate(
                    "buyer",
                    "name email mobile"
                )
                .populate("items.product")
                .populate(
                    "items.seller",
                    "name email"
                )
                .populate("address");

        res.json({
            message:
                "Delivery information updated",
            order: updatedOrder
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to update delivery",
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    updateDelivery
};