const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,         // Main display image (product list)
    gallery: [String],     // Extra angle images for product detail (max 4)
    description: String,
    category: String,
    sizes: [String],
    colors: [String],
    type: String,
});

module.exports = mongoose.model("Product", productSchema);