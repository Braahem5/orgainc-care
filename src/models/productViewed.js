const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const productViewSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  timestamp: Date,
});

module.exports =  mongoose.model("ProductViewed", productViewSchema);