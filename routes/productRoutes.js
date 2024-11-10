// routes/productRoutes.js
const express = require("express");
const {
  getProducts,
  addProductDetails,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

// Routes
router.get("/products", getProducts);
router.post("/add-product", addProductDetails);
router.get("/product/:_id", getProductById);

module.exports = router;
