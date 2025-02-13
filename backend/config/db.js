const mysql = require('mysql2');

// Database connection setup
const db = mysql.createConnection({
  host: 'localhost',   // Database host
  user: 'root',        // Your MySQL username
  password: 'root',    // Your MySQL password
  database: 'quiz_app' // Your MySQL database
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process if connection fails
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
