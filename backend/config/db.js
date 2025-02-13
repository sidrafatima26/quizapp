const { Pool } = require('pg');
 
// Connection string
const connectionString = 'postgres://neondb_owner:npg_iGkUova18WBx@ep-green-tree-a5021s5y-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';
// Replace with your actual connection string
// Example: postgresql://myuser:mypassword@localhost:5432/mydb
 
// Connection configuration using connection string
const db = new Pool({
  connectionString: connectionString,
});
 
// Test the connection
db.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1); // Exit if connection fails
  } else {
    console.log('Connected to PostgreSQL database');
    release(); // Release the client back to the pool
  }
});
 
module.exports = db;