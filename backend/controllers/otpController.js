// /controllers/otpController.js
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../config/db');
const otpStore = {};  // In-memory OTP store (use Redis or DB in production)

const generateOtp = () => crypto.randomInt(100000, 999999); // 6-digit OTP

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Send OTP
const sendOtp = (email) => {
  const otp = generateOtp();
  otpStore[email] = otp; // Store OTP temporarily

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw error;
    }
    console.log('OTP sent: ' + info.response);
  });
};

// Verify OTP
const verifyOtp = (email, otp) => {
  if (otpStore[email] && otpStore[email] === otp) {
    // Mark user as verified in DB
    db.query('UPDATE users SET otp_verified = ? WHERE email = ?', [true, email], (err, result) => {
      if (err) {
        console.error(err);
        throw err;
      }
      delete otpStore[email]; // Remove OTP after verification
      console.log('OTP verified successfully');
    });
    return true;
  } else {
    return false;
  }
};

module.exports = { sendOtp, verifyOtp };
