// Handle logging out and fetching initial funds
document.addEventListener('DOMContentLoaded', function() {
    fetchUserPot();  // Fetch the user's pot when the page loads
    fetchUserXP();

    // Logout functionality
    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');  // Remove JWT token upon logout
        alert('Logged out successfully.');
        window.location.href = './regOrLog.html';  // Redirect to login/signup page
    });

    // Event listeners for deposit buttons
    document.getElementById('deposit5').addEventListener('click', function() {
        handleDeposit(5);  // Deposit 5 units
    });

    document.getElementById('deposit10').addEventListener('click', function() {
        handleDeposit(10);  // Deposit 10 units
    });

    document.getElementById('deposit20').addEventListener('click', function() {
        handleDeposit(20);  // Deposit 20 units
    });
});

// Function to fetch and display the user's pot (funds)
async function fetchUserPot() {
    const token = localStorage.getItem('token');  // Get the stored JWT token

    if (!token) {
        document.getElementById('user-pot').textContent = 'Please log in';
        return;
    }

    try {
        const response = await fetch('https://peerplay-backend-4098d92d4443.herokuapp.com/auth/user/funds', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send JWT token to backend for authentication
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('user-pot').textContent = `Current Funds: £${data.pot}`;  // Display user's pot
        } else {
            console.error('Failed to fetch user pot:', data.message);
            document.getElementById('user-pot').textContent = 'Error fetching funds';
        }
    } catch (error) {
        console.error('Error fetching user pot:', error);
        document.getElementById('user-pot').textContent = 'Error loading pot';
    }
}

// Function to handle deposit
async function handleDeposit(amount) {
    const token = localStorage.getItem('token');  // Get the stored JWT token

    if (!token) {
        alert('User not authenticated. Please log in.');
        window.location.href = './regOrLog.html';  // Redirect to login if no user is authenticated
        return;
    }

    try {
        const response = await fetch('https://peerplay-backend-4098d92d4443.herokuapp.com/auth/user/deposit', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send JWT token to backend for authentication
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ depositAmount: amount })  // Send the deposit amount
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Deposit of £${amount} was successful!`);
            fetchUserPot();  // Refresh the displayed pot after deposit
        } else {
            alert(`Deposit failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error updating pot:', error);
        alert('An error occurred while processing your deposit.');
    }
}

// Function to fetch and display the user's xp
async function fetchUserXP() {
    const token = localStorage.getItem('token');  // Get the stored JWT token

    if (!token) {
        document.getElementById('user-xp').textContent = 'Please log in';
        return;
    }

    try {
        const response = await fetch('https://peerplay-backend-4098d92d4443.herokuapp.com/auth/user/xp', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send JWT token to backend for authentication
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user XP');
          }
      
          const data = await response.json();
          const xp = data.xp;
      
          // Update XP text
          document.getElementById('user-xp').textContent = xp;
      
          // Calculate the width percentage based on max XP (300)
          const fillPercentage = (xp / 300) * 100;
      
          // Update the fill width
          document.getElementById('xp-fill').style.width = fillPercentage + '%';
        } catch (error) {
          console.error('Error:', error);
          document.getElementById('user-xp').textContent = 'Error loading XP';
        }
}