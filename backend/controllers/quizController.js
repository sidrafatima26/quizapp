const db = require('../config/db');

// Submit quiz answers and calculate score
const submitQuiz = async (req, res) => {
  const { userId, answers } = req.body;  // Extract userId and the answers from the request body
  let score = 0;  // Initialize score

  // Begin a database transaction to ensure atomicity
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error starting transaction' });
    }

    // Use Promise.all to ensure all asynchronous queries are completed
    const answerPromises = answers.map(async (answer) => {
      const { questionId, selectedOption } = answer;

      // Query to get the correct answer for the current question
      const [results] = await db.promise().query(
        'SELECT correct_option FROM questions WHERE id = ?',
        [questionId]
      );

      if (results.length === 0) {
        // If no question is found, reject this answer
        return Promise.reject('Question not found.');
      }

      // Check if the selected option is correct
      const correctOption = results[0].correct_option;
      if (correctOption === selectedOption) {
        score += 1;  // Increase score for a correct answer
      }
    });

    // Wait for all answer checks to complete
    Promise.all(answerPromises)
      .then(() => {
        // After all answers are processed, store the score in the sessions table
        db.query(
          'INSERT INTO sessions (user_id, score) VALUES (?, ?)',
          [userId, score],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: 'Error saving session data.' });
              });
            }

            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ message: 'Error committing transaction.' });
                });
              }

              // Send success response with the calculated score
              res.status(200).json({ message: 'Quiz submitted successfully!', score });
            });
          }
        );
      })
      .catch((error) => {
        db.rollback(() => {
          res.status(500).json({ message: error || 'Error processing answers.' });
        });
      });
  });
};

module.exports = { submitQuiz };
