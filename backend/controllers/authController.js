const db = require('../config/db'); // MySQL database connection
const sendMail = require('../utils/mailer'); // Email sending functionality
const crypto = require('crypto');
const session = require('express-session');

// Helper function to generate OTP (6 digits)
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const subject = "Your OTP Code";
  const message = `Your OTP for login is: ${otp}. This OTP will expire in 5 minutes.`;

  try {
    await sendMail(email, subject, message);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
};

// Login route handler (Generate OTP)
exports.login = async (req, res) => {
  const { email } = req.body; // Assuming email is the unique identifier for login

  // Step 1: Check if the user exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Generate OTP (6-digit code)
    const otp = generateOTP();

    // Step 3: Set OTP expiration time (e.g., 5 minutes)
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Step 4: Save OTP and expiration time to database
    const userId = results[0].id;  // Get the user ID from the result
    db.query('UPDATE users SET otp = ?, otp_verified = ?, otp_expiration = ? WHERE id = ?', 
      [otp, false, otpExpiration, userId], async (err, updateResults) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving OTP', error: err });
      }

      // Step 5: Send OTP via email
      try {
        await sendOTPEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
      } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ message: 'Error sending OTP email', error: error });
      }
    });
  });
};

// Verify OTP route handler (Validate OTP and create session)
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  // Step 1: Check if the OTP matches and is not expired
  db.query('SELECT * FROM users WHERE email = ? AND otp = ? AND otp_expiration > NOW()', [email, otp], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }

    // Step 2: Mark OTP as verified
    const userId = results[0].id;
    db.query('UPDATE users SET otp_verified = ? WHERE id = ?', [true, userId], (err, updateResults) => {
      if (err) {
        return res.status(500).json({ message: 'Error verifying OTP', error: err });
      }

      // Step 3: Create session for the user after OTP verification
      req.session.user = {
        user_id: results[0].id,
        username: results[0].username,
        email: results[0].email,
      };

      res.status(200).json({ message: 'OTP verified successfully. User logged in.', session: req.session.user });
    });
  });
};

// Logout route handler (Clear session)
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout', error: err });
    }
    res.status(200).json({ message: 'User logged out successfully' });
  });
};
