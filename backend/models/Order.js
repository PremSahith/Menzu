const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        items: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                image: { type: String },
                size: { type: String },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
            },
        ],
        shippingAddress: {
            name: { type: String },
            address: { type: String },
            city: { type: String },
            zip: { type: String },
            country: { type: String },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        status: {
            type: String,
            enum: ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'],
            default: 'Ordered'
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
