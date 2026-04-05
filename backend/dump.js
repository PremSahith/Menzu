const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI, { dbName: "menzu" }).then(async () => {
    const p = await Product.find({});
    console.log(JSON.stringify(p, null, 2));
    process.exit(0);
});
