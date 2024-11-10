// controllers/productController.js
const Product = require("../models/Product");


// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// add product
exports.addProductDetails = async (req, res) => {
  // console.log(req.body);
  try {

    const newProduct = new Product({ ...req.body });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

//get product by id
exports.getProductById = async (req, res) => {
  const { _id } = req.params;
  const product = await Product.findById(_id);
  res.json(product);
};
