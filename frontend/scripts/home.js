// Function to update the countdown timer
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    const now = new Date();
    const nextLottery = getNextLotteryDate();

    // Calculate the time difference in milliseconds
    const timeDifference = nextLottery - now;

    // Convert milliseconds to days, hours, minutes, seconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // Display the result in the countdown element
    countdownElement.innerHTML = `${days} days, ${hours} hours, and ${minutes} minutes`;

    // Update the countdown every minute
    setTimeout(updateCountdown, 60000);  // Update every 60 seconds
}

// Initialize the countdown and winnings
window.onload = function() {
    updateCountdown();  // Start the countdown
};
