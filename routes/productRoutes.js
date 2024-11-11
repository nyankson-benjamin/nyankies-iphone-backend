// routes/productRoutes.js
const express = require("express");
const {
  getProducts,
  addProductDetails,
  getProductById,
  getProductByCategory,
  deleteProduct,
  checkout,
} = require("../controllers/productController");

const router = express.Router();

// Routes
router.get("/products", getProducts);
router.post("/add-product", addProductDetails);
router.get("/product/:_id", getProductById);
router.get("/categories/:category", getProductByCategory);
router.delete("/product/:_id", deleteProduct);
router.post("/checkout", checkout);

module.exports = router;
