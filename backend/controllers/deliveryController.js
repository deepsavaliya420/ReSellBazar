const Delivery = require("../models/Delivery");

const createDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.create(req.body);

        res.status(201).json({
            message: "Delivery created successfully",
            delivery
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create delivery",
            error: error.message
        });
    }
};

const getDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findOne({
            order: req.params.orderId
        }).populate("order");

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        res.json(delivery);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get delivery",
            error: error.message
        });
    }
};

const updateDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findOneAndUpdate(
            {
                order: req.params.orderId
            },
            req.body,
            {
                new: true
            }
        );

        res.json({
            message: "Delivery updated",
            delivery
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update delivery",
            error: error.message
        });
    }
};

module.exports = {
    createDelivery,
    getDelivery,
    updateDelivery
};