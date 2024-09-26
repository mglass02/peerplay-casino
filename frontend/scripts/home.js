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

async function fetchLotteryPot() {
    const companyPotElement = document.getElementById('company-pot');
    if (!companyPotElement) {
        console.error('Element with ID company-pot not found');
        return;
    }

    try {
        // Fetch the total pot from the backend, no need for authentication token
        const response = await fetch('https://peerplay-backend-4098d92d4443.herokuapp.com/auth/user/lottoFund', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Assuming the backend returns a 'pot' field with the total fund amount
            const halfPot = data.pot * 0.5;  // Calculate 50% of the total pot
            companyPotElement.textContent = `Current Funds (50%): £${halfPot.toFixed(2)}`;  // Display 50% of the total pot
        } else {
            console.error('Failed to fetch total pot:', data.message);
            companyPotElement.textContent = 'Error fetching funds';
        }
    } catch (error) {
        console.error('Error fetching total pot:', error);
        companyPotElement.textContent = 'Error loading pot';
    }
}


// Initialize the countdown and winnings
window.onload = function() {
    updateCountdown();  // Start the countdown
    fetchLotteryPot();
};
