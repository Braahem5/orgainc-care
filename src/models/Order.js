const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
    },
  ],

  shippingAddress: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  totalPrice: { type: Number }, //total amount of the order
  status: { type: String, default: "Pending" },
  orderDate: { type: Date, default: Date.now },
  paymentMethod: String
});

module.exports = mongoose.model("Order", OrderSchema);
