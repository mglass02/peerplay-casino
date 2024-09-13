document.addEventListener('DOMContentLoaded', function() {
    // Fetch stored user data (you would normally get this from a backend API)
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    // Display the user info on the account page
    document.getElementById('username').textContent = username;
    document.getElementById('email').textContent = email;

    // Handle saving the phone number
    document.getElementById('save-phone').addEventListener('click', function() {
        const phone = document.getElementById('phone').value;
        localStorage.setItem('phone', phone);  // Save phone number in localStorage (or send to backend)
        alert('Phone number saved.');
    });

    // Handle changing the password
    document.getElementById('change-password').addEventListener('click', async function() {
        const newPassword = document.getElementById('new-password').value;
        if (newPassword) {
            try {
                // You would make a request to the backend to change the password
                const response = await fetch('http://localhost:5000/auth/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: newPassword })
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Password changed successfully.');
                } else {
                    alert('Failed to change password: ' + data.message);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred. Please try again.');
            }
        } else {
            alert('Please enter a new password.');
        }
    });

    // Handle logging out
    document.getElementById('logout').addEventListener('click', function() {
        // Clear authentication data from localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        
        // Redirect to login page
        alert('Logged out successfully.');
        window.location.href = './regOrLog.html';
    });
});
