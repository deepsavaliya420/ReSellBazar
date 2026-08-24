const SupportTicket = require("../models/SupportTicket");

const createTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.create({
            user: req.user.id,
            subject: req.body.subject,
            message: req.body.message
        });

        res.status(201).json({
            message: "Support ticket created",
            ticket
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create ticket",
            error: error.message
        });
    }
};

const getMyTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({
            user: req.user.id
        });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get tickets",
            error: error.message
        });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find()
            .populate("user", "name email");

        res.json(tickets);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get tickets",
            error: error.message
        });
    }
};

const updateTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new: true
            }
        );

        res.json({
            message: "Ticket updated",
            ticket
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update ticket",
            error: error.message
        });
    }
};

module.exports = {
    createTicket,
    getMyTickets,
    getAllTickets,
    updateTicket
};