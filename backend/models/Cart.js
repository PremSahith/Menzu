const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,   // later we will use real userId
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);