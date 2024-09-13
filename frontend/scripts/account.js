

    // Handle logging out
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('logout').addEventListener('click', function() {
            // Clear all session-related data from localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('phone');
            
            // Notify the user and redirect to the login page
            alert('Logged out successfully.');
            window.location.href = './regOrLog.html'; // Redirect to login/signup page
        });
    });
    
