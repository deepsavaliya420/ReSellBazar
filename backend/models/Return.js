const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["requested", "approved", "rejected", "completed"],
        default: "requested"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Return", returnSchema);