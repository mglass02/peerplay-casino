document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in by verifying the token
    const isAuthenticated = checkAuthStatus();

    // Check if the game-container element exists
    const gameContainer = document.querySelector('.game-container');
    
    if (!isAuthenticated && gameContainer) {
        // Apply blur to game content if it exists
        gameContainer.classList.add('blurred');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div>
                <p>Please <a href="./regOrLog.html?redirect=dice.html">log in or sign up</a> to access the games.</p>
            </div>`;
        
        document.body.appendChild(overlay);
    } else if (isAuthenticated && gameContainer) {
        // If authenticated, remove blur (if it exists) and enable access to games
        gameContainer.classList.remove('blurred');
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.remove();
        }
    }
});

// Function to check if the user is authenticated
function checkAuthStatus() {
    const token = localStorage.getItem('token');  // Retrieve the JWT token from localStorage

    if (!token) {
        return false;  // No token found, user is not authenticated
    }

    try {
        // Decode the JWT token (base64 payload)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Check if the token has expired (using 'exp' field in JWT)
        if (payload.exp && Date.now() >= payload.exp * 1000) {
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

document.addEventListener('DOMContentLoaded', function() {
    const accountLink = document.querySelector('nav .main-nav li a[href="./regOrLog.html"]');

    if (accountLink) {
        if (localStorage.getItem('isAuthenticated') === 'true') {
            accountLink.setAttribute('href', './account.html');
            accountLink.textContent = 'Account';
        } else {
            accountLink.setAttribute('href', './regOrLog.html');
            accountLink.textContent = 'Log In';
        }
    } else {
        console.warn('Account link not found in the navigation.');  // Use 'warn' instead of 'error' for non-critical issues
    }
});

