import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const QuizResultPage = () => {
  const { id } = useParams(); // Get quiz ID from URL parameter
  const location = useLocation(); // Access the location object
  const { score } = location.state || {}; // Retrieve score from location state

  useEffect(() => {
    const createConfetti = () => {
      const confettiContainer = document.querySelector('.confetti-container');
      
      const confettiElements = []; // To store confetti elements for later removal
  
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
  
        // Random X, Y positions for confetti explosion
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
  
        // Random animation class for varying speeds and directions
        const animationType = Math.random() < 0.33 
          ? 'confetti-pop-slow' 
          : Math.random() < 0.66 
            ? 'confetti-pop-medium' 
            : 'confetti-pop-fast';
  
        confetti.classList.add(animationType);
        confetti.style.left = `${randomX}%`;
        confetti.style.top = `${randomY}%`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`; // Random color
        confetti.style.width = `${Math.random() * 15 + 5}px`; // Random width
        confetti.style.height = `${Math.random() * 15 + 5}px`; // Random height
        confettiContainer.appendChild(confetti);
        
        // Store confetti element for cleanup
        confettiElements.push(confetti);
  
        // Remove confetti after animation ends
        setTimeout(() => {
          if (confettiContainer.contains(confetti)) {
            confettiContainer.removeChild(confetti);
          }
        }, 3000); // Match animation duration
      }
    };
  
    createConfetti(); // Trigger confetti when component loads
  
    return () => {
      // Clean up confetti on unmount
      const confettiContainer = document.querySelector('.confetti-container');
      confettiContainer.innerHTML = ''; // Remove all existing confetti
    };
  }, []);
  

  return (
    <div className="container">
      <div className="confetti-container"></div> {/* Confetti container */}
      <div className="quiz-result">
        <h1>Quiz Results</h1>
        {score !== undefined ? (
          <div>
            <h2>Your Final Score: {score}</h2>
            <div className="checkmark-circle">
              <div className="background"></div>
              <div className="checkmark draw"></div>
            </div>
          </div>
        ) : (
          <div>No score available. Please complete the quiz.</div>
        )}
        <button className="submit-btn" onClick={() => alert('You can go to the next quiz')}>Submit</button>
      </div>
    </div>
  );
};

export default QuizResultPage;
