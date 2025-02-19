const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const crypto = require('crypto');
const sendMail = require('./utils/mailer');  // Import the mailer code with PowerShell Outlook automation
const db = require('./config/db'); // Import the MySQL database connection
const session = require('express-session'); // Import express-session for session management

const app = express();

// Middleware
/*app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:3000', // Allow React app's origin
    credentials: true, // Allow cookies and credentials
  }
)); // To allow frontend requests*/
// Allowing frontend URLs to be dynamic based on environment
const allowedOrigins = [
  'http://localhost:3000',  // Local development URL
  process.env.FRONTEND_URL,  // Production frontend URL (set in environment variables)
];

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Allow cookies and credentials
}));

// Session setup (before routes)
app.use(session({
  secret: '12345678', // Replace with a strong secret key (can be an environment variable)
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // Set session expiry to 1 hour
  httpOnly: true, // Make cookie accessible only through HTTP (prevents XSS)
}));

// Generate OTP function
const generateOtp = () => {
  return crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
};

// Route to send OTP to the user's email
app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;

  // Check if email already exists in the database
  db.query('SELECT * FROM users WHERE email = $1', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOtp();
    
    // Set OTP expiration time (5 minutes from now)
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);  // OTP expires in 5 minutes

    // Store OTP in the database
    db.query('UPDATE users SET otp = $1, otp_verified = $2, otp_expiration = $3 WHERE email = $4', 
      [otp, false, otpExpiration, email], async (err, updateResults) => {
      if (err) {
        return res.status(500).json({ message: 'Error storing OTP', error: err });
      }

      // Send OTP to user's email using PowerShell (Outlook)
      try {
        await sendMail(email, 'Your OTP Code', `Your OTP code is: ${otp}`);
        res.status(200).json({ message: 'OTP sent successfully' });
      } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ message: 'Error sending OTP email', error: error });
      }
    });
  });
});


// Route to verify OTP and create session
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  db.query('SELECT otp, otp_expiration, id FROM users WHERE email = $1', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const storedOtp = results.rows[0].otp;
    const otpExpiration = new Date(results.rows[0].otp_expiration);

    // Check if OTP has expired
    if (new Date() > otpExpiration) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if OTP matches
    if (storedOtp === otp) {
      // OTP is valid, mark it as verified in the database
      db.query('UPDATE users SET otp_verified = $1 WHERE email = $2', [true, email], (err, updateResults) => {
        if (err) {
          return res.status(500).json({ message: 'Error verifying OTP', error: err });
        }

        // Create session for the user after OTP verification
        req.session.user = {
          userId: results.rows[0].id,
          email: email,
          sessionId: req.sessionID, // Store session ID explicitly
        };

        console.log('Session Created:', req.session);

        // Send success response
        res.status(200).json({
          message: 'OTP verified successfully, user logged in.',
          session: req.session.user
        });
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  });
});




// Fetch all quizzes (no change)
app.get('/api/quizzes', (req, res) => {
  db.query('SELECT * FROM quizzes', (err, results) => {
    if (err) {
      console.error('Error fetching quizzes:', err);
      return res.status(500).json({ message: 'Error fetching quizzes', error: err });
    }
    res.status(200).json(results.rows);  // Send the fetched quizzes as a response
  });
});

// Fetch a single quiz by its ID
app.get('/api/quiz/:id', (req, res) => {
  const quizId = req.params.id;

  db.query('SELECT * FROM quizzes WHERE id = $1', [quizId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching quiz data', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    db.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId], (err, questions) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching quiz questions', error: err });
      }

      const quizData = {
        ...results.rows[0],  // Quiz information
        questions: questions.rows,  // Quiz questions
      };

      return res.status(200).json(quizData);
    });
  });
});




// Submit answers and calculate score
const getSelectedAnswers = async (userId, quizId, selectedAnswers) => { 
  try {
    const questionsQuery = `
      SELECT id, marks, answer_options
      FROM questions
      WHERE quiz_id = $1
    `;
    const [questions] = await db.promise().query(questionsQuery, [quizId]);

    let totalScore = 0;

    selectedAnswers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        const answerOptions = JSON.parse(question.answer_options);
        const correctAnswer = answerOptions.find(option => option.is_correct === true);
        if (correctAnswer && correctAnswer.answer_text === answer.selectedOption) {
          totalScore += question.marks;
        }
      }
    });

    return totalScore;
  } catch (error) {
    console.error('Error calculating score:', error);
    throw new Error('Error calculating score');
  }
};

// Route to submit answers and calculate score
app.post('/api/submit-quiz', async (req, res) => {
  const { quizId, answers } = req.body;

  if (!req.session.user || !req.session.user.userId) {
    return res.status(401).json({ message: 'User not logged in or session expired' });
  }

  const userId = req.session.user.userId; // Access userId from the session
  const sessionId = req.session.user.sessionId; // Assuming sessionId is stored in session

  try {
    // Calculate score
    const totalScore = await getSelectedAnswers(userId, quizId, answers);

    const insertResultQuery = `
      INSERT INTO results (session_id, user_id, quiz_id, score)
      VALUES ($1, $2, $3, $4)
    `;
    await db.execute(insertResultQuery, [sessionId, userId, quizId, totalScore]);

    res.status(200).json({ message: 'Quiz submitted successfully', score: totalScore });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Error processing the quiz submission', error });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
