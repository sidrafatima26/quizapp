import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import './../../src/App.css';

const QuizPage = () => {
  const { id } = useParams(); // Get quiz ID from URL parameter
  const navigate = useNavigate(); // Initialize navigate
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question index
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track answers for all questions
  const [timer, setTimer] = useState(30); // Timer for each question (30 seconds per question)
  const [score, setScore] = useState(0); // Total score

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/api/quiz/${id}`);
        const data = await response.json();
        console.log('Fetched Quiz Data:', data);
        
        if (data) {
          setQuiz(data);
        } else {
          console.error('Quiz not found');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };
  
    fetchQuizData();
  }, [id]); // Fetch quiz data on mount or when `id` changes
   // Fetch quiz data on mount or when `id` changes

  // Function to calculate the score whenever selectedAnswers changes
  useEffect(() => {
    let totalScore = 0; // Initialize total score to 0
    Object.entries(selectedAnswers).forEach(([questionId, selectedAnswerText]) => {
      const question = quiz?.questions.find((q) => q.id === parseInt(questionId));
      if (question) {
        // Find the selected answer object by matching answer_text
        const selectedAnswer = question.answer_options.find(
          (answer) => answer.answer_text === selectedAnswerText
        );
        
        // Check if the selected answer is correct (is_correct: true)
        if (selectedAnswer?.is_correct) {
          totalScore += question.marks; // Add marks for correct answer
        }
      }
    });

    setScore(totalScore); // Update the score
    console.log('Current Score:', totalScore); // Log current score to console
  }, [selectedAnswers, quiz]); // Re-run when selectedAnswers or quiz changes

  // Memoize the handleNextQuestion function to prevent it from being recreated on every render
  const handleNextQuestion = useCallback(() => {
    if (selectedAnswers[quiz?.questions[currentQuestionIndex]?.id]) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to next question
      setTimer(30); // Reset timer for the next question
    }
  }, [selectedAnswers, currentQuestionIndex, quiz]);

  // Countdown timer for each question
  useEffect(() => {
    if (timer > 0 && currentQuestionIndex < quiz?.questions.length) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    } else if (timer === 0) {
      handleNextQuestion(); // Move to next question when timer expires
    }
  }, [timer, currentQuestionIndex, quiz, handleNextQuestion]);

  // Submit quiz and redirect to the QuizResultPage with the score
  const submitQuiz = async () => {
    if (currentQuestionIndex !== quiz?.questions.length) {
      //alert('Please complete the quiz before submitting.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/api/submit-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: id, answers: getAnswers() }),
      });
      const data = await response.json();
      console.log(data.message);

      // After submitting, redirect to results page and pass the score in state
      navigate(`/quiz-results/${id}`, { state: { score } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  // Get answers in the required format to send to the backend (assuming { questionId, answerId })
  const getAnswers = () => {
    return quiz?.questions.map((question) => ({
      questionId: question.id,
      answerId: selectedAnswers[question.id],
    }));
  };

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  if (!quiz?.questions || quiz.questions.length === 0) {
    return <div>No questions available for this quiz.</div>;
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  return (
    <div>
      <h1>{quiz.quiz_title}</h1>

      {/* Display Question and Timer */}
      <div>
        <h3>{currentQuestion?.question_text}</h3>
        <div>Time Left: {timer}s</div>

        {/* Display the answer options */}
        <div className="answers">
          {currentQuestion?.answer_options.map((answer) => (
            <div
              key={answer.answer_text} // Use answer_text as key since it's unique
              className={`answer-option ${selectedAnswers[currentQuestion.id] === answer.answer_text ? 'selected' : ''}`} // Apply 'selected' class based on text match
              onClick={() => {
                setSelectedAnswers((prevAnswers) => ({
                  ...prevAnswers,
                  [currentQuestion.id]: answer.answer_text, // Store answer by question ID
                }));
              }}
            >
              {answer.answer_text}
            </div>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div>
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            className="next-question-btn"
            onClick={handleNextQuestion} 
            disabled={!selectedAnswers[currentQuestion.id]}>
            Next Question
          </button>
        ) : (
          <button className="submit-quiz-btn" onClick={submitQuiz}>Submit Quiz</button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
