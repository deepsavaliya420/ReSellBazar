const Order = require("../models/Order");
const Product = require("../models/Product");


const createOrder = async (req, res) => {
    try {
        const orderItems = [];

        for (const item of req.body.items) {

            const product =
                await Product.findById(
                    item.product
                );

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (
                product.quantity <
                item.quantity
            ) {
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

        const totalAmount =
            orderItems.reduce(
                (total, item) =>
                    total +
                    item.price *
                        item.quantity,
                0
            );

        const order =
            await Order.create({
                buyer: req.user.id,

                items: orderItems,

                address:
                    req.body.address,

                totalAmount,

                paymentMethod:
                    req.body.paymentMethod ||
                    "cod",

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


/*
    Get only orders which contain
    products belonging to the logged-in seller.
*/
const getSellerOrders = async (
    req,
    res
) => {
    try {

        const orders =
            await Order.find({
                "items.seller":
                    req.user.id
            })
                .populate(
                    "buyer",
                    "name email mobile"
                )
                .populate(
                    "items.product"
                )
                .populate(
                    "items.seller",
                    "name email"
                )
                .populate("address")
                .sort({
                    createdAt: -1
                });

        const sellerOrders =
            orders.map((order) => {

                const sellerItems =
                    order.items.filter(
                        (item) => {

                            const seller =
                                item.seller;

                            const sellerId =
                                typeof seller ===
                                "object"
                                    ? seller?._id?.toString()
                                    : seller?.toString();

                            return (
                                sellerId ===
                                req.user.id.toString()
                            );
                        }
                    );

                const sellerTotalAmount =
                    sellerItems.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.price || 0
                            ) *
                                Number(
                                    item.quantity || 0
                                ),
                        0
                    );

                return {
                    ...order.toObject(),

                    items:
                        sellerItems,

                    sellerTotalAmount
                };
            });

        res.json(sellerOrders);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to get seller orders",
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
                .populate(
                    "items.product"
                )
                .populate(
                    "items.seller",
                    "name email"
                )
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


const updateOrderStatus = async (
    req,
    res
) => {
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
            !validStatuses.includes(
                status
            )
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
                message:
                    "Order not found"
            });
        }

        /*
            Sellers can only update an order
            if at least one item belongs to them.
        */
        if (
            req.user.role === "seller"
        ) {

            const sellerOwnsOrder =
                order.items.some(
                    (item) => {

                        const seller =
                            item.seller;

                        const sellerId =
                            typeof seller ===
                            "object"
                                ? seller?._id?.toString()
                                : seller?.toString();

                        return (
                            sellerId ===
                            req.user.id.toString()
                        );
                    }
                );

            if (!sellerOwnsOrder) {
                return res.status(403).json({
                    message:
                        "You are not authorized to update this order"
                });
            }
        }

        order.orderStatus =
            status;

        const now =
            new Date();

        if (
            status === "shipped"
        ) {
            order.delivery.shippedAt =
                now;
        }

        if (
            status ===
            "out_for_delivery"
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
                .populate(
                    "items.product"
                )
                .populate(
                    "items.seller",
                    "name email"
                )
                .populate("address");

        res.json({
            message:
                "Order status updated",
            order:
                updatedOrder
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to update order",
            error: error.message
        });
    }
};


const updateDelivery = async (
    req,
    res
) => {
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
                message:
                    "Order not found"
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
            estimatedDelivery !==
            undefined
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
                .populate(
                    "items.product"
                )
                .populate(
                    "items.seller",
                    "name email"
                )
                .populate("address");

        res.json({
            message:
                "Delivery information updated",
            order:
                updatedOrder
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
    getSellerOrders,
    getAllOrders,
    updateOrderStatus,
    updateDelivery
};