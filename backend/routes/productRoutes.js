const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products (optionally filtered by category)
router.get("/", async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category: { $regex: new RegExp(`^${category}$`, 'i') } } : {};
    const products = await Product.find(filter);
    res.json(products);
});

// GET single product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: "Invalid product ID" });
    }
});

module.exports = router;