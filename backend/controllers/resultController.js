// /controllers/resultController.js
const db = require('../config/db');

const submitQuizResult = (req, res) => {
  const { userId, quizId, answers } = req.body;

  // Initialize the total score and answered count
  let totalScore = 0;
  let answeredCount = 0;

  answers.forEach((answer) => {
    db.query('SELECT is_correct, question_id FROM answers WHERE id = ?', [answer.answerId], (err, answerResults) => {
      if (err) return res.status(500).json({ message: 'Error checking answer', error: err });

      if (answerResults.length === 0) {
        return res.status(400).json({ message: 'Invalid answer ID' });
      }

      const isCorrect = answerResults[0].is_correct;
      const questionId = answerResults[0].question_id;

      // Check if the answer is correct and add the score
      if (isCorrect) {
        db.query('SELECT marks FROM questions WHERE id = ?', [questionId], (err, questionResults) => {
          if (err) return res.status(500).json({ message: 'Error fetching question marks', error: err });

          if (questionResults.length === 0) {
            return res.status(400).json({ message: 'Invalid question ID' });
          }

          totalScore += questionResults[0].marks;
          answeredCount++;

          // Once all answers are processed, save the result
          if (answeredCount === answers.length) {
            const resultQuery = 'INSERT INTO results (user_id, quiz_id, score) VALUES (?, ?, ?)';
            db.query(resultQuery, [userId, quizId, totalScore], (err, result) => {
              if (err) return res.status(500).json({ message: 'Error submitting result', error: err });

              return res.status(200).json({ message: 'Quiz submitted successfully', score: totalScore });
            });
          }
        });
      } else {
        answeredCount++;
        if (answeredCount === answers.length) {
          const resultQuery = 'INSERT INTO results (user_id, quiz_id, score) VALUES (?, ?, ?)';
          db.query(resultQuery, [userId, quizId, totalScore], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error submitting result', error: err });

            return res.status(200).json({ message: 'Quiz submitted successfully', score: totalScore });
          });
        }
      }
    });
  });
};

module.exports = { submitQuizResult };
