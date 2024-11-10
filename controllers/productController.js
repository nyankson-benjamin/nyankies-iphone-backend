// controllers/productController.js
const Product = require("../models/Product");
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const itemsTosSend = products.map(product => ({
      _id:product._id,
      title:product.title,
      price:product.price,
      brand:product.brand,
      description:product.description,
      category:product.category,
      stock:product.stock,
      images: product.images.map(img => img.url)
    }));
    res.json(itemsTosSend);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// add product
exports.addProductDetails = async (req, res) => {
  try {
    const { images, ...productData } = req.body;

    // Upload images to Cloudinary
    const uploadPromises = images.map(async ({ id, image }) => {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: 'products', // Optional: organize images in folders
        resource_type: 'auto',
      });

      return {
        id,
        url: result.secure_url,
        public_id: result.public_id
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Create new product with image URLs
    const newProduct = new Product({
      ...productData,
      images: uploadedImages
    });
    
    
    await newProduct.save();
    const itemsTosSend = {
     
      // images: uploadedImages,
      _id:newProduct._id,
      title:newProduct.title,
      price:newProduct.price,
      brand:newProduct.brand,
      description:newProduct.description,
      category:newProduct.category,
      // stock:newProduct.stock
    } 
    res.status(201).json(itemsTosSend);
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

exports.deleteProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Product.findById(_id);

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(img => 
        cloudinary.uploader.destroy(img.public_id)
      );
      await Promise.all(deletePromises);
    }

    // Delete product from database
    await Product.findByIdAndDelete(_id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// get product by category
exports.getProductByCategory = async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });
  const itemsTosSend = products.map(product => ({
    _id:product._id,
    title:product.title,
    price:product.price,
    brand:product.brand,
    description:product.description,
    category:product.category,
    images: product.images.map(img => img.url)
  }));
  res.json(itemsTosSend);
};
