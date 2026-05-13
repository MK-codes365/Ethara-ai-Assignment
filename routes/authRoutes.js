const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  signup,
  login,
  getMyProfile,
  signupValidation,
  loginValidation
} = require('../controllers/authController');

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Protected route
router.get('/me', authMiddleware, getMyProfile);

module.exports = router;
