const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

// Placeholder since user didn't specify. You should use process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            addresses: user.addresses || [],
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (!user.password) return res.status(400).json({ message: "Log in with Google" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            addresses: user.addresses || [],
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/google
// @desc    Authenticate with Google
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
        });
        
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // Check if user exists
        let user = await User.findOne({ email });
        
        if (user) {
            // Update googleId if not present (legacy email/password accounts connecting Google)
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new Google user
            user = await User.create({
                name,
                email,
                googleId,
                addresses: []
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            addresses: user.addresses || [],
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid Google Token", error: error.message });
    }
});

module.exports = router;
