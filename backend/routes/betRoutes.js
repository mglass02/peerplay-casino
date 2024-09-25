// File: /routes/betRoutes.js

const express = require('express');
const router = express.Router();
const Bet = require('../models/betModel');
const User = require('../models/User');
const { fetchMatchResults, calculateWinnings } = require('../services/betService');

// Place a bet
router.post('/place-bet', async (req, res) => {
    const { matchId, betType, betAmount, odds, matchDetails } = req.body;
    const userId = req.user._id;

    try {
        // Get user
        const user = await User.findById(userId);

        if (user.balance < betAmount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct bet amount from user balance
        user.balance -= betAmount;
        await user.save();

        // Create a new bet
        const newBet = new Bet({
            userId,
            matchId,
            matchDetails,
            betType,
            betAmount,
            odds,
            potentialWinnings: betAmount * odds
        });

        await newBet.save();
        res.status(200).json({ message: 'Bet placed successfully!', bet: newBet });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update bets with match results (called by cron job)
router.post('/update-bets', async (req, res) => {
    try {
        const pendingBets = await Bet.find({ status: 'pending' });
        const results = await fetchMatchResults(); // Fetch from API

        for (const bet of pendingBets) {
            const matchResult = results.find(match => match.id === bet.matchId);
            if (matchResult) {
                const hasWon = calculateWinnings(bet, matchResult);
                bet.status = hasWon ? 'won' : 'lost';
                bet.resultChecked = true;
                await bet.save();

                // If user won, add winnings to balance
                if (hasWon) {
                    const user = await User.findById(bet.userId);
                    user.balance += bet.potentialWinnings;
                    await user.save();
                }
            }
        }

        res.status(200).json({ message: 'Bets updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
