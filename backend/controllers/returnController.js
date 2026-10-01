const Return = require("../models/Return");
const Order = require("../models/Order");

const createReturn = async (req, res) => {
    try {
        const {
            order: orderId,
            reason
        } = req.body;

        if (!orderId || !reason?.trim()) {
            return res.status(400).json({
                message:
                    "Order ID and return reason are required"
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (
            order.buyer.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You are not authorized to request a return for this order"
            });
        }

        if (
            order.orderStatus !==
            "delivered"
        ) {
            return res.status(400).json({
                message:
                    "A return can only be requested for a delivered order"
            });
        }

        const existingReturn =
            await Return.findOne({
                order: order._id,
                buyer: req.user.id,
                status: {
                    $in: [
                        "requested",
                        "approved"
                    ]
                }
            });

        if (existingReturn) {
            return res.status(400).json({
                message:
                    "A return request already exists for this order"
            });
        }

        const returnRequest =
            await Return.create({
                order: order._id,
                buyer: req.user.id,
                reason: reason.trim(),
                status: "requested"
            });

        const populatedReturn =
            await Return.findById(
                returnRequest._id
            )
                .populate("order")
                .populate(
                    "buyer",
                    "name email mobile"
                );

        res.status(201).json({
            message:
                "Return request submitted successfully",
            returnRequest:
                populatedReturn
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to create return request",
            error: error.message
        });
    }
};


const getReturns = async (req, res) => {
    try {

        const returns =
            await Return.find({
                buyer: req.user.id
            })
                .populate("order")
                .sort({
                    createdAt: -1
                });

        res.json(returns);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to get returns",
            error: error.message
        });
    }
};


const getAllReturns = async (req, res) => {
    try {

        const returns =
            await Return.find()
                .populate(
                    "buyer",
                    "name email mobile"
                )
                .populate("order")
                .sort({
                    createdAt: -1
                });

        res.json(returns);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to get all returns",
            error: error.message
        });
    }
};


const updateReturn = async (req, res) => {
    try {

        const {
            status
        } = req.body;

        const validStatuses = [
            "requested",
            "approved",
            "rejected",
            "completed"
        ];

        if (
            !validStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid return status"
            });
        }

        const returnRequest =
            await Return.findById(
                req.params.id
            );

        if (!returnRequest) {
            return res.status(404).json({
                message:
                    "Return request not found"
            });
        }

        if (
            returnRequest.status ===
            "rejected"
        ) {
            return res.status(400).json({
                message:
                    "A rejected return cannot be updated"
            });
        }

        if (
            returnRequest.status ===
            "completed"
        ) {
            return res.status(400).json({
                message:
                    "A completed return cannot be updated"
            });
        }

        if (
            status === "completed" &&
            returnRequest.status !== "approved"
        ) {
            return res.status(400).json({
                message:
                    "Only an approved return can be completed"
            });
        }

        returnRequest.status = status;

        await returnRequest.save();

        const updatedReturn =
            await Return.findById(
                returnRequest._id
            )
                .populate(
                    "buyer",
                    "name email mobile"
                )
                .populate("order");

        res.json({
            message:
                "Return status updated successfully",
            returnRequest:
                updatedReturn
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to update return",
            error: error.message
        });
    }
};


module.exports = {
    createReturn,
    getReturns,
    getAllReturns,
    updateReturn
};