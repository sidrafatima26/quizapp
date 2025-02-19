// src/services/authService.js

export const sendOtp = async (email) => {
  const response = await fetch(`http://localhost:5000/api/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP');
  }
};

export const verifyOtp = async (email, otp) => {
  const response = await fetch(`http://localhost:5000/api/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    throw new Error('Failed to verify OTP');
  }

  const data = await response.json();
  return data.isVerified; // Assuming the response contains isVerified field
};