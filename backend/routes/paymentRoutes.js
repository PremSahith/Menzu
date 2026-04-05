const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

// @route   POST /api/payments/order
// @desc    Create a razorpay order
router.post("/order", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Cap order at 500,000 (paise/cents) which is 5000 USD to prevent Razorpay test mode maximum limit error
        const maxTestAmount = Math.min(req.body.amount, 500000);

        const options = {
            amount: maxTestAmount, 
            currency: "INR",
            receipt: "receipt_order_" + Math.floor(Math.random() * 1000000),
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json(error);
    }
});

module.exports = router;
