const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const runLottery = require('./jobs/lotteryJob');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // This allows all origins, you can restrict this if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve files from the /pages/ directory as root
app.use('/', express.static(path.join(__dirname, '../frontend/pages')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);

// Fallback route (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/home.html'));
});

runLottery();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
