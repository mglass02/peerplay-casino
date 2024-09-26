// Check if the user is authenticated
function checkAuthStatus() {
    const token = localStorage.getItem('token');  // Retrieve the JWT token from localStorage

    if (!token) {
        return false;  // No token found, user is not authenticated
    }

    try {
        // Decode the JWT token (base64 payload)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Check if the token has expired (using 'exp' field in JWT)
        if (payload.exp && Date.now() >= payload.exp * 1000) {  // Multiply exp by 1000 to convert to milliseconds
            console.log("Token has expired");
            localStorage.removeItem('token');  // Remove the expired token
            return false;
        }

        return true;  // Token is valid and not expired
    } catch (error) {
        console.error('Invalid token format:', error);
        return false;
    }
}


// Handle DOM content load
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = checkAuthStatus();  // Check if user is authenticated
    const gameContainer = document.querySelector('.game-container');

    // Handle game access
    if (!isAuthenticated && gameContainer) {
        // Apply blur to game content if not authenticated
        gameContainer.classList.add('blurred');

        // Create overlay with a login/signup prompt
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div>
                <p>Please <a href="/regOrLog?redirect=/dice">log in or sign up</a> to access the games.</p>
            </div>`;
        
        document.body.appendChild(overlay);
    } else if (isAuthenticated && gameContainer) {
        // If authenticated, remove blur and enable access to games
        gameContainer.classList.remove('blurred');
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Handle account link in the header
    const accountLink = document.querySelector('nav .main-nav li a[href="/regOrLog"]');

    if (accountLink) {
        if (isAuthenticated) {
            // If authenticated, link to account page
            accountLink.setAttribute('href', './account');
            accountLink.textContent = 'Account';
        } else {
            // If not authenticated, link to login/signup page
            accountLink.setAttribute('href', './regOrLog');
            accountLink.textContent = 'Account';
        }
    } else {
        console.warn('Account link not found in the navigation.');  // Warn if account link is not found
    }
});

// Game buttons
document.addEventListener('DOMContentLoaded', function () {
    const gameCostButtons = document.querySelectorAll('.game-cost');
    const rollButton = document.getElementById('rollDice') || document.getElementById('roll-button') || document.getElementById('hit-button');

    gameCostButtons.forEach(button => {
        button.addEventListener('click', function () {
            const amount = parseInt(this.getAttribute('data-amount'), 10);
            handleGamePayment(amount);  // Process payment before enabling the game
        });
    });

    // Function to handle game payment
    async function handleGamePayment(amount) {
        const token = localStorage.getItem('token');  // Get the stored JWT token

        if (!token) {
            alert('User not authenticated. Please log in.');
            window.location.href = '/regOrLog';  // Redirect to login if no user is authenticated
            return;
        }

        try {
            const response = await fetch('https://peerplay-backend-4098d92d4443.herokuapp.com/auth/user/play-game', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send JWT token to backend for authentication
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })  // Send the chosen amount
            });

            const data = await response.json();

            if (response.ok) {
                alert(`You have successfully paid £${amount} to play!`);
                rollButton.disabled = false;  // Enable the game after payment
            } else {
                alert(`Payment failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('An error occurred while processing your payment.');
        }
    }
});

// Function to calculate the time remaining until next Friday at 12pm
function getNextLotteryDate() {
    const now = new Date();
    const nextFriday = new Date();

    // Find the next Friday
    const dayOfWeek = now.getDay();  // 0 = Sunday, 6 = Saturday
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;  // Calculate days to next Friday

    // If it's Friday after 12pm, move to the next Friday
    nextFriday.setDate(now.getDate() + daysUntilFriday);
    nextFriday.setHours(12, 0, 0, 0);  // Set to 12:00pm

    // If today is Friday and past 12pm, move to the next Friday
    if (now.getDay() === 5 && now.getHours() >= 12) {
        nextFriday.setDate(nextFriday.getDate() + 7);
    }

    return nextFriday;
}