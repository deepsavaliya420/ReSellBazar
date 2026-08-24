const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        quantity: Number,
        price: Number
    }],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        default: "cod"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: [
            "placed",
            "confirmed",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ],
        default: "placed"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);