const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    condition: {
        type: String,
        enum: ["new", "used"],
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);