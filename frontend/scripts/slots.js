const icon_width = 79, 
      icon_height = 79, 
      num_icons = 9, 
      time_per_icon = 100,
      indexes = [0, 0, 0],
      icon_map = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "watermelon"];

let player_pot = 0; // Player's pot
let selectedAmount = null; // Selected betting amount

// Fetch the current user's pot from the backend
async function fetchUserPot() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('User not authenticated. Please log in.');
        window.location.href = './regOrLog.html';
        return;
    }

    try {
        const response = await fetch('https://peerplay-backend-373c075b1ee9.herokuapp.com//auth/user/funds', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            player_pot = data.pot;  // Set the user's pot from the backend
            document.getElementById('player-pot').textContent = "Player Pot: £" + player_pot;
        } else {
            alert('Failed to fetch player pot: ' + data.message);
        }
    } catch (error) {
        console.error('Error fetching user pot:', error);
        alert('Error fetching player pot. Please try again later.');
    }
}

// Function to roll the slot reels
const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);
    const style = getComputedStyle(reel),
          backgroundPositionY = parseFloat(style["background-position-y"]),
          targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
          normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

    return new Promise((resolve) => {
        reel.style.transition = `background-position-y ${8 + delta * time_per_icon}ms`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

        setTimeout(() => {
            reel.style.transition = 'none';
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            resolve(delta % num_icons);
        }, 8 + delta * time_per_icon);
    });
};

// Function to handle the backend payment
async function handlePayment(amount) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('https://peerplay-backend-373c075b1ee9.herokuapp.com//auth/user/play-game', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });

        const data = await response.json();

        if (!response.ok) {
            alert('Payment failed: ' + data.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error processing payment:', error);
        return false;
    }
}

// Function to transfer winnings to the player
async function transferWinnings(amount) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('https://peerplay-backend-373c075b1ee9.herokuapp.com//auth/user/win', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });

        const data = await response.json();

        if (!response.ok) {
            alert('Failed to transfer winnings: ' + data.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error transferring winnings:', error);
        return false;
    }
}

async function rollAll() {
    const reelsList = document.querySelectorAll('.slots > .reels');
    const playerPotElement = document.getElementById('player-pot');
    const winStatusElement = document.getElementById('win-status');
    const rollButton = document.getElementById('roll-button');

    // Check if the player has selected a bet amount
    if (selectedAmount === null) {
        winStatusElement.textContent = "Please select an amount to play!";
        return;
    }

    // Check if the player has enough funds
    if (player_pot < selectedAmount) {
        winStatusElement.textContent = "Not enough funds. Please deposit more.";
        return;
    }

    // Send payment request to the backend
    const paymentSuccess = await handlePayment(selectedAmount);

    if (!paymentSuccess) {
        winStatusElement.textContent = "Payment failed. Please try again.";
        return;
    }

    // Deduct the selected amount from the player's pot (frontend update only)
    player_pot -= selectedAmount;
    playerPotElement.textContent = "Player Pot: £" + player_pot;
    winStatusElement.textContent = "Waiting for result...";

    // Roll all the reels
    Promise
        .all([...reelsList].map((reels, i) => roll(reels, i)))
        .then(async (deltas) => {
            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);

            // Check win condition
            let winMessage = 'No win';
            let winnings = 0;

            // If all three reels match, JACKPOT (5x the bet)
            if (indexes[0] == indexes[1] && indexes[1] == indexes[2]) {
                winnings = selectedAmount * 5;
                const winningsTransferred = await transferWinnings(winnings);
                if (winningsTransferred) {
                    player_pot += winnings; // Add winnings to player's pot (frontend)
                }
                winMessage = `JACKPOT! You win £${winnings}!`;
            } 
            // If two reels match, small win (1.5x the bet)
            else if (indexes[0] == indexes[1] || indexes[0] == indexes[2] || indexes[1] == indexes[2]) {
                winnings = selectedAmount * 1.5;
                const winningsTransferred = await transferWinnings(winnings);
                if (winningsTransferred) {
                    player_pot += winnings; // Add winnings to player's pot (frontend)
                }
                winMessage = `Big win! You win £${winnings.toFixed(2)}!`;
            } 
            // No win
            else {
                winMessage = 'You lose!';
            }

            // Update the DOM with the current player pot and win status
            playerPotElement.textContent = "Player Pot: £" + player_pot;
            winStatusElement.textContent = winMessage;

            // Check if the player pot reaches 0
            if (player_pot <= 0) {
                player_pot = 0; // Ensure pot doesn't go negative
                playerPotElement.textContent = "Player Pot: £" + player_pot;
                winStatusElement.textContent = "No funds left! Please deposit.";
                document.getElementById('deposit-options').style.display = "block"; // Show deposit options
            }

            // Reset selected amount after roll
            selectedAmount = null;
            // Hide the amount buttons after rolling
            document.getElementById('bet-amounts').style.display = 'none';
            rollButton.disabled = false;
        });
}

// Event listener for roll button to show bet amount options
document.getElementById('roll-button').addEventListener('click', function() {
    // Show bet amount options
    document.getElementById('bet-amounts').style.display = 'block';
    document.getElementById('win-status').textContent = "Select an amount to play!";
    this.disabled = true; // Disable roll button until amount is selected
});

// Event listener for bet amount buttons
document.querySelectorAll('.bet-amount').forEach(button => {
    button.addEventListener('click', function() {
        selectedAmount = parseInt(this.getAttribute('data-amount'), 10);
        document.getElementById('win-status').textContent = `You chose to play with £${selectedAmount}. Now, spin the reels!`;
        document.getElementById('roll-button').disabled = false; // Enable roll button after amount is selected
        rollAll(); // Start the game after selecting the bet amount
    });
});

// Event listener for deposit buttons
document.querySelectorAll('.deposit-btn').forEach(button => {
    button.addEventListener('click', function() {
        const depositValue = parseInt(this.getAttribute('data-value'), 10);
        player_pot += depositValue; // Add the deposit value to the player's pot

        // Update the player pot display
        document.getElementById('player-pot').textContent = "Player Pot: £" + player_pot;
        document.getElementById('win-status').textContent = "Deposit successful! Roll again.";

        // Show the Roll button and hide deposit options
        document.getElementById('roll-button').style.display = "block";
        document.getElementById('deposit-options').style.display = "none";
    });
});

// Initialize game when the DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated
    const isAuthenticated = checkAuthStatus();

    if (!isAuthenticated) {
        handleUnauthenticated(); // Blur the screen and show login prompt
    } else {
        fetchUserPot();  // Fetch the player's pot when the page is loaded
    }
});
