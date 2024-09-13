// Handle Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Fetch the signup form values
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Make POST request to backend signup route
    const response = await fetch('http://localhost:5000/auth/signup', {  // Assuming backend is running on localhost:5000
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    // Handle the response from the server
    if (response.ok) {
      alert('Signup successful!');
    } else {
      alert('Signup failed: ' + data.message);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred. Please try again later.');
  }
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Fetch the login form values
  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;

  try {
    // Make POST request to backend login route
    const response = await fetch('http://localhost:5000/auth/login', {  
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // Handle the response from the server
    if (response.ok) {
      // Store a token or login flag in localStorage or sessionStorage
      localStorage.setItem('isAuthenticated', 'true');  // Set this to 'true' or use a token
      alert('Login successful!');
      // Optionally redirect to the page the user was trying to access
      window.location.href = data.redirect || './home.html';  // Redirect to the home or any other page
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred. Please try again later.');
  }
});

