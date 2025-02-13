import React, { useState } from 'react';
import { sendOtp, verifyOtp } from '../api';  // Import the necessary functions
import '../../src/App.css';  // Import the CSS file

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Function to send OTP to the provided email
  const handleSendOtp = async () => {
    if (!email) {
      setErrorMessage('Please enter a valid email.');
      return;
    }

    try {
      const response = await sendOtp(email);
      if (response && response.message === 'OTP sent successfully') {
        setIsOtpSent(true);
        setErrorMessage('');
      } else {
        setErrorMessage(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error("Error during OTP sending:", error);
      setErrorMessage(error.message || 'An error occurred while sending OTP.');
    }
  };

  // Function to handle OTP verification
  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      setErrorMessage('Please enter both email and OTP');
      return;
    }

    try {
      const response = await verifyOtp(email, otp);

      if (response && response.message === 'OTP verified successfully, user logged in.') {
        // Successful login, redirect the user
        localStorage.setItem('session', JSON.stringify(response.session)); // Save session data
        window.location.href = '/home';  // Redirect to home or wherever you need
      } else {
        setErrorMessage(response.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setErrorMessage(error.message || 'An error occurred during OTP verification. Please try again later.');
    }
  };

  return (
    <div className="login-page" >
      {/*<video autoPlay loop muted className="video-background">
        <source src="matrix-rain-codes.1920x1080.mp4" type="video/mp4" />
      </video>*/}
     
      <div> 
      <h2 >Login</h2>

      {/* Email Input */}
    
        <input
          type="email"
          className="input-field"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="otp-button" onClick={handleSendOtp}>Send OTP</button>
      </div>

      {/* OTP Input */}
      {isOtpSent && (
        <div>
          <input
            type="text"
            className="input-field"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="otp-button" onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}

      {/* Error Message Display */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* OTP sent message */}
      {isOtpSent && <p className="success-message">OTP sent successfully. Please check your email.</p>}
    
    </div>
  );
};

export default LoginPage;