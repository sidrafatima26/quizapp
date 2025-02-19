// Send OTP to the user's email
export const sendOtp = async (email) => {
  try {
    const response = await fetch(`http://localhost:5000/api/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }), // Send the email in the body
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    const data = await response.json();
    return data; // Return the response data (success message or error)
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error; // Rethrow error to be handled in the calling component
  }
};

// Verify the OTP entered by the user

export const verifyOtp = async (email, otp) => {
  try {
    const response = await fetch(`http://localhost:5000/api/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }), // Send email and OTP to verify
    });

    console.log('Server Response Status:', response.status); // Log status code
    const data = await response.json(); // Get response JSON

    // Log full response to understand the structure
    console.log('Server Response Data:', data);

    if (!response.ok) {
      throw new Error('Invalid OTP'); // Throw error if response is not OK
    }

    return data; // Return the response data (success message with session or error)
  } catch (error) {
    console.error('Error verifying OTP:', error); // Log error
    throw error; // Rethrow the error to be handled in the calling component
  }
};

// Fetch the details of a single quiz by its ID
export const getQuizDetails = async (quizId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/quiz/${quizId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch quiz details');
    }
    return await response.json(); // Return quiz data
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    return []; // Return empty array if error occurs
  }
};

// Fetch all quizzes
export const getQuizzes = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/quizzes`);
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    return await response.json(); // Return quizzes data
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return []; // Return an empty array if there is an error
  }
};

// Submit quiz results
export const submitQuizResult = async (result) => {
  try {
    const response = await fetch(`http://localhost:5000/api/submit-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Quiz submitted successfully:', data);
    } else {
      console.error('Error submitting quiz:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
