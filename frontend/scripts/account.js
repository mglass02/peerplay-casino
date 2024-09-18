// Handle logging out
document.addEventListener('DOMContentLoaded', function() {
    fetchUserPot();  // Fetch the user's pot when the page loads

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');  // Remove JWT token upon logout
        alert('Logged out successfully.');
        window.location.href = './regOrLog.html';  // Redirect to login/signup page
    });
});

// Function to fetch and display the user's pot (funds)
async function fetchUserPot() {
    const token = localStorage.getItem('token');  // Get the stored JWT token

    if (!token) {
        document.getElementById('user-pot').textContent = 'Please log in';
        return;
    }

    console.log('Token:', token);  // Log the token for debugging

    try {
        // Send a request to the backend to fetch the user's pot
        const response = await fetch('http://localhost:5000/auth/user/funds', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send JWT token to backend for authentication
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);  // Log the status code

        const data = await response.json();

        if (response.ok) {
            document.getElementById('user-pot').textContent = `Current Funds: $${data.pot}`;  // Display user's pot
        } else {
            console.error('Failed to fetch user pot:', data.message);
            document.getElementById('user-pot').textContent = 'Error fetching funds';
        }
    } catch (error) {
        console.error('Error fetching user pot:', error);
        document.getElementById('user-pot').textContent = 'Error loading pot';
    }
}

