const form = document.getElementById('adminLoginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const username = form.username.value;
        const password = form.password.value;

        console.log('Sending login request...'); // Debug log

        const response = await fetch('http://localhost:3000/admin-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        console.log('Response received:', response.status); // Debug log

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data); // Debug log

        if (data.success) {
            alert('Login Successful!');
            // window.location.href = './dashboard.html';  // Uncomment to enable redirect
        } else {
            alert(`Login Failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Server error. Please try again later.');
    }
});