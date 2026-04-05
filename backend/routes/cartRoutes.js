const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");


// ➕ Add to Cart
router.get("/test", (req, res) => {
    res.send("Cart route working");
});

router.post("/add", async (req, res) => {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({
            userId,
            items: [{ productId, quantity: 1 }]
        });
    } else {
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items.push({ productId, quantity: 1 });
        }
    }

    await cart.save();
    res.json(cart);
});


// 📦 Get Cart
router.get("/:userId", async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId })
        .populate("items.productId");

    res.json(cart);
});

// ❌ Remove from Cart
router.post("/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ userId });
        
        if (cart) {
            cart.items = cart.items.filter(
                item => item.productId.toString() !== productId
            );
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔄 Update Quantity
router.post("/update", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
                await cart.save();
            }
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;