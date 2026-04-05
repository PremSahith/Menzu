const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const ALL_COLORS = ['Midnight', 'Heather Gray', 'Ecru', 'Tobacco', 'Navy'];
const CATEGORIES = ['T-shirt', 'Hoodie'];

const dummyImages = [
];

const names = ["Premium Blank Tee", "Washed Graphic Tee", "Heavyweight Box-Fit", "Ecru Essential", "Graphic Vintage Tee", "Minimalist Cut Logo", "Oversized Fleece Hoodie", "Pigment Dyed Hoodie", "Thermal Waffle Knit Tee", "Everyday Zip Hoodie"];

const generateProducts = (num) => {
    const products = [];
    for (let i = 1; i <= num; i++) {
        const title = names[Math.floor(Math.random() * names.length)] + ` V${Math.floor(Math.random() * 9) + 1}`;
        const description = `Premium grade material. Drop ${i} collection.`;
        const price = Math.floor(Math.random() * 300) + 40;
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const image = dummyImages[Math.floor(Math.random() * dummyImages.length)];

        const colors = [];
        const numColors = Math.floor(Math.random() * 3) + 1;
        for (let c = 0; c < numColors; c++) {
            const color = ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];
            if (!colors.includes(color)) colors.push(color);
        }

        const sizes = [];
        const numSizes = Math.floor(Math.random() * 3) + 2;
        for (let s = 0; s < numSizes; s++) {
            const size = ALL_SIZES[Math.floor(Math.random() * ALL_SIZES.length)];
            if (!sizes.includes(size)) sizes.push(size);
        }

        products.push({ title, description, price, category, image, colors, sizes, type });
    }
    return products;
}

const seedData = generateProducts(30); // Generated 30 for a nice dense grid!

mongoose.connect(process.env.MONGO_URI, { dbName: "menzu" }).then(async () => {
    await Product.deleteMany({});
    console.log("Deleted old products.");
    await Product.insertMany(seedData);
    console.log(`Seeded ${seedData.length} new products with sizes and colors.`);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
