// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  phone: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
    unique: false,
  },
  address: {
    type: String,
    required: true,
    unique: false,
  },

  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  confirmationToken: String,
  recoveryToken: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
