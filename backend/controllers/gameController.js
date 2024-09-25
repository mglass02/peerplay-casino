const User = require('../models/User');

// Controller function to handle playing the game and payment
exports.playGame = async (req, res) => {
    const { amount } = req.body;

    try {
        const user = req.user;  // The user is already attached to req.user by the middleware

        // Check if the user has enough funds
        if (user.pot < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Calculate the 1% transaction fee
        const fee = amount * 0.01;

        // Calculate the remaining amount (99%) that will be used for the game
        const playAmount = amount * 0.99;

        // Deduct the total amount from the user's pot
        user.pot -= amount;

        // Get the current day of the week
        const today = new Date().getDay();

        // Check if today is Saturday (6) or Sunday (0)
        if (today === 6 || today === 0) {
            // Weekend - double the XP points
            user.xp += (amount * 10) * 2;
        } else {
            // Weekday - normal XP points
            user.xp += amount * 10;
        }

        // Find the peerplaycasino account (casino's account)
        const casinoUser = await User.findOne({ email: 'peerplaycasino@gmail.com' });

        if (!casinoUser) {
            return res.status(500).json({ message: 'Casino account not found' });
        }

        // Add the 99% amount to the casino's pot
        casinoUser.pot += playAmount;

        // Find the user with email michael.andrew.glass@gmail.com to receive the 1% fee
        const feeRecipient = await User.findOne({ email: 'michael.andrew.glass@gmail.com' });

        if (!feeRecipient) {
            return res.status(500).json({ message: 'Fee recipient not found' });
        }

        // Add the 1% fee to the recipient's pot
        feeRecipient.pot += fee;

        // Save both users' updated pots
        await user.save();
        await casinoUser.save();
        await feeRecipient.save();

        // Respond with success
        res.status(200).json({ message: 'Payment successful', userPot: user.pot });
    } catch (error) {
        console.error('Error in playGame:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Controller function to handle winnings
exports.winGame = async (req, res) => {
    const { amount } = req.body;

    try {
        const user = req.user;  // The user is already attached to req.user by the middleware

        // Find the peerplaycasino account (casino's account)
        const casinoUser = await User.findOne({ email: 'peerplaycasino@gmail.com' });

        if (!casinoUser) {
            return res.status(500).json({ message: 'Casino account not found' });
        }

        // Check if the casino has enough funds to pay the winnings
        if (casinoUser.pot < amount) {
            return res.status(500).json({ message: 'Casino does not have enough funds to pay the winnings' });
        }

        // Deduct the winnings from the casino's pot
        casinoUser.pot -= amount;

        // Add the winnings to the user's pot
        user.pot += amount;

        // Save both users' updated pots
        await user.save();
        await casinoUser.save();

        // Respond with success
        res.status(200).json({ message: 'Winnings transferred successfully' });
    } catch (error) {
        console.error('Error in winGame:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
