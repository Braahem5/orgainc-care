const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseHistorySchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number },
  purchaseDate: Date,
});

module.exports= mongoose.model("PurchaseHistory", purchaseHistorySchema);