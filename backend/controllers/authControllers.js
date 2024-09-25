const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Signup logic
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login logic 
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
          { id: user._id },
          'yourSecretKey',  // Make sure this key matches the key in the middleware
          { expiresIn: '1h' }
      );

      // Send the token to the client
      res.status(200).json({
          token,
          message: 'Login successful'
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};


// Get user funds (protected route)
exports.getUserFunds = async (req, res) => {
  try {
    // Find the user by ID (we have the user's ID because of the JWT middleware)
    const user = await User.findById(req.user.id).select('pot'); // Only select the 'pot' field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's funds
    res.status(200).json({ pot: user.pot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// deposit funds 
// Controller function to handle deposits
exports.depositMoney = async (req, res) => {
  const { depositAmount } = req.body;

  try {
      // The user is already attached to req.user by the protect middleware
      const user = req.user;

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's pot
      user.pot += depositAmount;

      // Save the updated user data
      await user.save();

      // Respond with success
      return res.status(200).json({ message: 'Deposit successful', pot: user.pot });
  } catch (error) {
      // Handle any errors that occur
      return res.status(500).json({ message: 'Server error', error });
  }
};

// Get user funds (protected route)
exports.getUserXP = async (req, res) => {
  try {
    // Find the user by ID (we have the user's ID because of the JWT middleware)
    const user = await User.findById(req.user.id).select('xp'); // Only select the 'pot' field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's funds
    res.status(200).json({ xp: user.xp });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Route to fetch the current pot
exports.lottoFund = async (req, res) => {
  try {
      const companyUser = await User.findOne({ email: 'peerplaycasino@gmail.com' });

      if (!companyUser) {
          return res.status(404).json({ message: 'Company account not found.' });
      }

      res.json({ pot: companyUser.pot });
  } catch (error) {
      console.error('Error fetching company pot:', error);
      res.status(500).json({ message: 'Server error' });
  }
};