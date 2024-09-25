// File: /models/betModel.js

const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchId: { type: String, required: true }, // Match ID from the API
    matchDetails: { type: Object, required: true }, // Store match details (teams, odds, etc.)
    betType: { type: String, required: true }, // Win/Draw/Loss
    betAmount: { type: Number, required: true },
    odds: { type: Number, required: true },
    potentialWinnings: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
    resultChecked: { type: Boolean, default: false }, // Check if match result is processed
});

module.exports = mongoose.model('Bet', betSchema);
