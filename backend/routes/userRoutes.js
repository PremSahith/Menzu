const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   POST /api/users/:id/addresses
// @desc    Add a new address to a user
router.post("/:id/addresses", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const newAddress = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/users/:id/addresses/:addressId
// @desc    Delete an address
router.delete("/:id/addresses/:addressId", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.addresses = user.addresses.filter(
            (addr) => addr._id.toString() !== req.params.addressId
        );

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
