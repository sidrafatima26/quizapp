// /routes/resultRoutes.js
const express = require('express');
const { submitQuizResult } = require('../controllers/resultController');
const router = express.Router();

// Submit quiz result
router.post('/submit', submitQuizResult);

module.exports = router;
