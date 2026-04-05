const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @route   POST /api/orders
// @desc    Create new order and clear user's cart
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        const order = new Order({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid,
        });

        const createdOrder = await order.save();

        // Automatically clear cart
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/user/:id
// @desc    Get logged in user orders
router.get("/user/:id", async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status directly (Mock Admin/Dev tool)
router.put("/:id/status", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
