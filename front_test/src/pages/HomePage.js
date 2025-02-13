import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import { getQuizzes } from '../api'; // Assuming getQuizzes fetches quizzes from the backend

const HomePage = () => {
  const [quizzes, setQuizzes] = useState([]); // Store quizzes in state
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        console.log('Fetching quizzes...'); // Debugging log
        const data = await getQuizzes(); // Fetch quizzes from the backend API
        console.log('Fetched quizzes:', data); // Debugging log
        setQuizzes(data); // Set quizzes data to state

        if (data.length === 0) {
          console.log('No quizzes found, redirecting to /no-quizzes'); // Debugging log
          navigate('/no-quizzes'); // Example redirection if no quizzes found
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error); // Error handling
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    }

    fetchQuizzes(); // Call the function to fetch quizzes
  }, [navigate]); // Empty dependency array means this runs only once, when the component is mounted

  // If quizzes are still loading, display a loading message
  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  return (
    <div>
      <h1>Available Quizzes</h1>
      <div className="quiz-cards-container">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <Link to={`/quiz/${quiz.id}`} className="quiz-link">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p> {/* Optional description */}
              </Link>
            </div>
          ))
        ) : (
          <div>No quizzes available</div> // If no quizzes are available
        )}
      </div>
    </div>
  );
};

export default HomePage;
