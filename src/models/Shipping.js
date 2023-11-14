const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  shippingMethod: { type: String, required: true },
  domesticRates: [
    {
      countryName: { type: String, required: true },
      rate: { type: Number, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: Number, required: true },
    },
  ],
  internationalRates: [
    {
      countryName: { type: String },
      rate: { type: Number },
      city: { type: String },
      state: { type: String },
      zipCode: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Shipping", shippingSchema);
