const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    imageUrl: String,
    description: String,
    price: Number,
    currency: String,
    category: String,
    stockQuantity: Number
});


module.exports = mongoose.model("Product", productSchema);