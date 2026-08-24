const Payment = require("../models/Payment");

const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create({
            order: req.body.order,
            buyer: req.user.id,
            amount: req.body.amount,
            method: req.body.method,
            transactionId: req.body.transactionId
        });

        res.status(201).json({
            message: "Payment created",
            payment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create payment",
            error: error.message
        });
    }
};

const getPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            order: req.params.orderId
        });

        res.json(payment);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get payment",
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    getPayment
};