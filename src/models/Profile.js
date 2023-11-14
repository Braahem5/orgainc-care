const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address: String,
  phoneNumber: Number,
  preferredCurrency: { type: String },
});

module.exports = mongoose.model("Profile", profileSchema);