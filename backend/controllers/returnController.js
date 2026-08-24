const Return = require("../models/Return");

const createReturn = async (req, res) => {
    try {
        const returnRequest = await Return.create({
            order: req.body.order,
            buyer: req.user.id,
            reason: req.body.reason
        });

        res.status(201).json({
            message: "Return request submitted",
            returnRequest
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create return request",
            error: error.message
        });
    }
};

const getReturns = async (req, res) => {
    try {
        const returns = await Return.find({
            buyer: req.user.id
        }).populate("order");

        res.json(returns);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get returns",
            error: error.message
        });
    }
};

const updateReturn = async (req, res) => {
    try {
        const returnRequest = await Return.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new: true
            }
        );

        res.json({
            message: "Return status updated",
            returnRequest
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update return",
            error: error.message
        });
    }
};

module.exports = {
    createReturn,
    getReturns,
    updateReturn
};