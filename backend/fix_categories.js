const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI, { dbName: "menzu" }).then(async () => {
    const products = await Product.find({});

    let updated = 0;
    for (const p of products) {
        const titleLower = p.title.toLowerCase();
        let category = null;

        if (titleLower.includes('hoodie') || titleLower.includes('hood') || titleLower.includes('sweatshirt') || titleLower.includes('pullover') || titleLower.includes('fleece') || titleLower.includes('zip')) {
            category = 'hoodie';
        } else if (titleLower.includes('tshirt') || titleLower.includes('t-shirt') || titleLower.includes('tee') || titleLower.includes('graphic') || titleLower.includes('shirt')) {
            category = 'tshirt';
        }

        if (category && p.category !== category) {
            await Product.updateOne({ _id: p._id }, { $set: { category } });
            console.log(`✅ "${p.title}" → ${category}`);
            updated++;
        } else if (!category) {
            console.log(`⚠️  Could not auto-detect category for: "${p.title}" — skipped`);
        } else {
            console.log(`— "${p.title}" already has category: ${p.category}`);
        }
    }

    console.log(`\nDone! Updated ${updated} products.`);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
