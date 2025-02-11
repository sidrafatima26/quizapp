// src/services/authService.js

// authService.js

// Send OTP request to the server
export const sendOtp = async (email) => {
  try {
    const response = await fetch('http://localhost:5000/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }), // Send the email
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    const data = await response.json();
    return data; // Success message
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error; // Handle errors
  }
};

// Verify OTP request to the server
export const verifyOtp = async (email, otp) => {
  try {
    const response = await fetch('http://localhost:5000/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }), // Send OTP and email for verification
    });

    if (!response.ok) {
      throw new Error('Failed to verify OTP');
    }

    const data = await response.json();
    return data; // Verification result
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error; // Handle errors
  }
};
