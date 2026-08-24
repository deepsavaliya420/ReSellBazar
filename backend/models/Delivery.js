const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    trackingNumber: String,
    courier: String,
    status: {
        type: String,
        enum: [
            "processing",
            "shipped",
            "out_for_delivery",
            "delivered"
        ],
        default: "processing"
    },
    estimatedDate: Date
}, {
    timestamps: true
});

module.exports = mongoose.model("Delivery", deliverySchema);