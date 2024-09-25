// Handle Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Fetch the signup form values
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Make POST request to backend signup route
    const response = await fetch('https://https://sprightly-dolphin-5975b2.netlify.app/auth/signup', {  // Assuming backend is running on https://sprightly-dolphin-5975b2.netlify.app
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

  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;

  try {
      const response = await fetch('https://https://sprightly-dolphin-5975b2.netlify.app/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
          // Store the JWT token in localStorage
          localStorage.setItem('token', data.token); // Store the token
          alert('Login successful!');
          window.location.href = './home.html'; // Redirect to home or any page after login
      } else {
          alert('Login failed: ' + data.message);
      }
  } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again later.');
  }
});


