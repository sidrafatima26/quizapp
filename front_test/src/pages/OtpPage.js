
// src/pages/OtpPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../api';
import '../../src/App.css';  

const OtpPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await sendOtp(email);
      alert('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(email, otp);
      console.log(response.status);
      if (response.status === 200) {
        navigate('/home');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      alert('Error verifying OTP. Please try again.');
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="container">
      <h2>Verify OTP</h2>
      <input
        type="email"
        className="input-field"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="otp-button" onClick={handleSendOtp}>Send OTP</button>

      <input
        type="text"
        className="input-field"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button className="otp-button" onClick={handleVerifyOtp}>Verify OTP</button>
    </div>
  );
};

export default OtpPage;
