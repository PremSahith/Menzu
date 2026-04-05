require("dotenv").config();   // 🔥 MUST BE FIRST

const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./config/db");
connectDB();

app.use(cors());
app.use(express.json()); // needed to parse JSON body

// 🔹 Home route
app.get("/", (req, res) => {
    res.send("API Running...");
});

const Product = require("./models/Product");

// 🔹 GET all products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔹 DELETE all products (for cleanup via Postman)
app.delete("/products", async (req, res) => {
    try {
        await Product.deleteMany({});
        res.json({ message: "Successfully deleted all products from the database" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔹 Seed multiple products via POST (for Postman)
app.post("/seed-products", async (req, res) => {
    try {
        const products = req.body; // expecting an array of products
        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "Send an array of products" });
        }
        const created = await Product.insertMany(products);
        res.json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🔹 Route mounting
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// 🔹 Start server
app.listen(5001, () => {
    console.log("Server running on port 5001");
});

console.log("ENV:", process.env.MONGO_URI);