const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user login and OTP generation
router.post('/login', authController.login);

// Route for verifying OTP
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
