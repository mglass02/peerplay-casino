document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isAuthenticated = checkAuthStatus();

    if (!isAuthenticated) {
        // Apply blur to game content
        document.querySelector('.game-container').classList.add('blurred');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div>
                <p>Please <a href="./regOrLog.html?redirect=dice.html">log in or sign up</a> to access the games.</p>
            </div>`;
        
        document.body.appendChild(overlay);
    }
});

function checkAuthStatus() {
    // Check localStorage for login status
    return localStorage.getItem('isAuthenticated') === 'true';  // Use 'true' as the login flag
}

document.addEventListener('DOMContentLoaded', function() {
    const accountLink = document.querySelector('nav .main-nav li a[href="./regOrLog.html"]');

    if (localStorage.getItem('isAuthenticated') === 'true') {
        // Change the link to account.html if the user is logged in
        accountLink.setAttribute('href', './account.html');
        accountLink.textContent = 'Account';
    } else {
        // Set it back to regOrLog.html if not logged in
        accountLink.setAttribute('href', './regOrLog.html');
        accountLink.textContent = 'Log In / Sign Up';
    }
});
