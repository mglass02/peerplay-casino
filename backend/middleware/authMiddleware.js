const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract the token from "Bearer <token>"

      // Verify the token
      const decoded = jwt.verify(token, 'yourSecretKey'); // Replace with your secret key

      // Attach user to the request object
      req.user = await User.findById(decoded.id).select('-password'); // Attach user without password to req.user

      next(); // Continue to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
