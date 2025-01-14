const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: Array,
  userId: String,
  totalAmount: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date,
  address: String,
  phone: String,
  location: String,
  email: String,
  name: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
