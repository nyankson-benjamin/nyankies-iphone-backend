// routes/authRoutes.js
const express = require('express');
const {
  signup,
  confirmAccount,
  login,
  recoverPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Confirm account route
router.get('/confirm/:token', confirmAccount);

// Login route
router.post('/login', login);

// Password recovery route
router.post('/recover', recoverPassword);

// Reset password route
router.post('/reset', resetPassword);

module.exports = router;
