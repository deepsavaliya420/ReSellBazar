const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
    amount: Number,
    method: {
        type: String,
        enum: ["cod", "online"]
    },
    transactionId: String,
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);