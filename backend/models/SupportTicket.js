const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        senderRole: {
            type: String,
            enum: ["buyer", "seller", "admin"],
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);


const supportTicketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        messages: {
            type: [supportMessageSchema],
            default: []
        },

        status: {
            type: String,
            enum: [
                "open",
                "in_progress",
                "resolved",
                "closed"
            ],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "SupportTicket",
        supportTicketSchema
    );