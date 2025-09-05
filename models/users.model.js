const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: String,
    email: { type: String, unique: true },
    password: String,
    token:    { type: String, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema, "user");

module.exports = User;
