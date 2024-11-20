// models/Product.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: String, required:true },
  image: { type: Object, required:true },
});

module.exports = mongoose.model("UserProfiles", profileSchema);
