const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: User},
    product: { type: mongoose.Schema.Types.ObjectId, ref: Product},
    quantity: Number,
    totalPrice: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);