const express = require('express');
const { signup, login, getUserFunds } = require('../controllers/authControllers'); // Ensure 'getUserFunds' is correctly imported
const protect = require('../middleware/authMiddleware'); // Import the middleware to protect the route
const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Get user funds (protected route)
router.get('/user/funds', protect, getUserFunds); // Make sure getUserFunds is defined

module.exports = router;
