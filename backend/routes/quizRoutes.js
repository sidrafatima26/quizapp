const express = require('express');
const { verifyOtp } = require('../controllers/authController'); // Import OTP verification function
const { getQuizzes } = require('../controllers/quizController'); // Import quiz fetching function
const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOtp);

// Route to verify OTP and fetch quizzes
router.post('/verify-otp', verifyOtp);

// Route to fetch quizzes (no session required here)
router.get('/quizzes', getQuizzes);

module.exports = router;
