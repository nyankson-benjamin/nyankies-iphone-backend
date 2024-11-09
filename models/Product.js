// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  photo: { type: String },
  brand: { type: String },
  description: { type: String },
  category: { type: String },
  stock: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  images: { type: Array },
  details:{type:Object}

});

module.exports = mongoose.model("Product", productSchema);
