// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Sign-In users
    googleId: { type: String },
    addresses: [{
        name: String,
        address: String,
        city: String,
        zip: String,
        country: String
    }],
});

module.exports = mongoose.model("User", userSchema);