const mongoose = require("mongoose");

const roles ={
  ADMIN: "admin",
  USER :"user"
} 

const userSchema = new mongoose.Schema({
  authMethod: { type: String, default: "local" },
  googleid: { type: String },
  username: { type: String, required: true },
  email: { type: String, required: true },
  profilePicURL: { type: String},
  password: { type: String },
  role: { type: String, enum: [roles.ADMIN, roles.USER], default: roles.USER },
});

module.exports = mongoose.model("User", userSchema);
