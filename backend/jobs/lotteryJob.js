const cron = require('node-cron');
const User = require('../models/User');

// Cron job to run every Friday at 12 PM
const runLottery = () => {
  cron.schedule('0 12 * * 5', async () => {
    try {
      console.log('Running weekly lottery...');

      // Step 1: Get the company pot holder (the user with email peerplaycasino@gmail.com)
      const companyUser = await User.findOne({ email: 'peerplaycasino@gmail.com' });
      if (!companyUser) {
        console.log('Company pot user not found.');
        return;
      }

      // Step 2: Get eligible users with at least 300 XP, excluding michael.andrew.glass@gmail.com
      const eligibleUsers = await User.find({
        xp: { $gte: 300 },
        email: { $ne: 'michael.andrew.glass@gmail.com' } // Exclude michael.andrew.glass@gmail.com from winning
      }).select('email pot');

      if (eligibleUsers.length === 0) {
        console.log('No eligible users for this week.');
        return;
      }

      // Step 3: Find the user with the email michael.andrew.glass@gmail.com (for the 10% allocation)
      const michaelUser = await User.findOne({ email: 'michael.andrew.glass@gmail.com' });

      if (!michaelUser) {
        console.log('Michael’s account not found.');
        return;
      }

      // Step 4: Calculate 50% for the random winner and 10% for Michael
      const totalPot = companyUser.pot;
      const winnerPrize = totalPot * 0.5;
      const devPot = totalPot * 0.2;

      // Step 5: Select a random winner (excluding Michael)
      const winnerIndex = Math.floor(Math.random() * eligibleUsers.length);
      const winner = eligibleUsers[winnerIndex];

      // Step 6: Update the winner's pot with 50% of the company pot
      await User.findByIdAndUpdate(winner._id, { $inc: { pot: winnerPrize } });

      // Step 7: Add 10% of the company pot to Michael's account
      michaelUser.pot += devPot;
      await michaelUser.save();

      // Step 8: Announce the winner and Michael’s prize
      console.log(`The winner of this week's lottery is: ${winner.email}. They won £${winnerPrize}.`);
      console.log(`Michael (dev) received £${devPot} from the company pot.`);

      // Step 9: Reduce the company pot by the total payout (50% + 20%)
      companyUser.pot -= (winnerPrize + devPot);
      await companyUser.save();

      // Step 10: Reset XP for all users back to 0
      await User.updateMany({}, { $set: { xp: 0 } });

      console.log('Lottery completed, XP reset, and company pot updated.');
    } catch (error) {
      console.error('Error running the weekly lottery:', error);
    }
  });
};

module.exports = runLottery;
