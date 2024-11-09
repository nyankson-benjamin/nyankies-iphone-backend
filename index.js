// index.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const axios = require('axios');

require('dotenv').config();
const cors = require("cors");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' folder
app.use(express.urlencoded({ extended: true }));

app.use(cors());
// Routes
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);

app.post('/api/device-details', async (req, res) => {
    console.log(req.body);
    try {
      const response = await axios.post(process.env.GSM_URL, req.body);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// Export the Express app as a serverless function
module.exports = app;

// Only listen to port if running locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
