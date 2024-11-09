// controllers/productController.js
const Product = require('../models/Product');

// Add a new product with file upload
exports.addProduct = async (req, res) => {
  try {
    const { name, title, price } = req.body;
    const photo = req.file ? req.file.path : null;

    const newProduct = new Product({ name, title, price, photo });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// add product 
exports.addProductDetails = async (req, res) => {
  console.log(req.body);
};
