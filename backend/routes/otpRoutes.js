// /routes/otpRoutes.js
const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const router = express.Router();

// Send OTP
router.post('/send-otp', (req, res) => {
  const { email } = req.body;
  sendOtp(email);
  res.status(200).json({ message: 'OTP sent successfully' });
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (verifyOtp(email, otp)) {
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

module.exports = router;
