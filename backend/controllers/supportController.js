const SupportTicket = require("../models/SupportTicket");


const createTicket = async (req, res) => {
    try {

        const {
            subject,
            message
        } = req.body;

        if (!subject || !message) {
            return res.status(400).json({
                message:
                    "Subject and message are required"
            });
        }

        const ticket =
            await SupportTicket.create({
                user: req.user.id,
                subject,
                message,
                messages: [
                    {
                        sender: req.user.id,
                        senderRole: req.user.role,
                        message
                    }
                ]
            });

        const populatedTicket =
            await SupportTicket.findById(
                ticket._id
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "messages.sender",
                    "name email role"
                );

        res.status(201).json({
            message:
                "Support ticket created",
            ticket: populatedTicket
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to create ticket",
            error: error.message
        });
    }
};


const getMyTickets = async (req, res) => {
    try {

        const tickets =
            await SupportTicket.find({
                user: req.user.id
            })
                .populate(
                    "messages.sender",
                    "name email role"
                )
                .sort({
                    updatedAt: -1
                });

        res.json(tickets);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to get tickets",
            error: error.message
        });
    }
};


const getAllTickets = async (req, res) => {
    try {

        const tickets =
            await SupportTicket.find()
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "messages.sender",
                    "name email role"
                )
                .sort({
                    updatedAt: -1
                });

        res.json(tickets);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to get tickets",
            error: error.message
        });
    }
};


const getTicketById = async (req, res) => {
    try {

        const ticket =
            await SupportTicket.findById(
                req.params.id
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "messages.sender",
                    "name email role"
                );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Support ticket not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            ticket.user._id.toString() !==
                req.user.id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You are not authorized to view this ticket"
            });
        }

        res.json(ticket);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to get support ticket",
            error: error.message
        });
    }
};


const updateTicket = async (req, res) => {
    try {

        const {
            status
        } = req.body;

        const allowedStatuses = [
            "open",
            "in_progress",
            "resolved",
            "closed"
        ];

        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid ticket status"
            });
        }

        const ticket =
            await SupportTicket.findByIdAndUpdate(
                req.params.id,
                {
                    status
                },
                {
                    new: true,
                    runValidators: true
                }
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "messages.sender",
                    "name email role"
                );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Support ticket not found"
            });
        }

        res.json({
            message:
                "Ticket updated",
            ticket
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to update ticket",
            error: error.message
        });
    }
};


const addTicketMessage = async (req, res) => {
    try {

        const {
            message
        } = req.body;

        if (
            !message ||
            !message.trim()
        ) {
            return res.status(400).json({
                message:
                    "Message is required"
            });
        }

        const ticket =
            await SupportTicket.findById(
                req.params.id
            );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Support ticket not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            ticket.user.toString() !==
                req.user.id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You are not authorized to reply to this ticket"
            });
        }

        if (ticket.status === "closed") {
            return res.status(400).json({
                message:
                    "This ticket is closed"
            });
        }

        ticket.messages.push({
            sender: req.user.id,
            senderRole: req.user.role,
            message: message.trim()
        });

        if (
            req.user.role === "admin" &&
            ticket.status === "open"
        ) {
            ticket.status =
                "in_progress";
        }

        if (
            req.user.role !== "admin" &&
            ticket.status === "resolved"
        ) {
            ticket.status =
                "in_progress";
        }

        await ticket.save();

        const updatedTicket =
            await SupportTicket.findById(
                ticket._id
            )
                .populate(
                    "user",
                    "name email role"
                )
                .populate(
                    "messages.sender",
                    "name email role"
                );

        res.status(201).json({
            message:
                "Message added successfully",
            ticket: updatedTicket
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to add message",
            error: error.message
        });
    }
};


module.exports = {
    createTicket,
    getMyTickets,
    getAllTickets,
    getTicketById,
    updateTicket,
    addTicketMessage
};