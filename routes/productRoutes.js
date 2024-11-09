// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const { addProduct, getProducts, addProductDetails } = require('../controllers/productController');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post('/products', upload.single('photo'), addProduct);
router.get('/products', getProducts);
router.post('/add-product', addProductDetails);

module.exports = router;
