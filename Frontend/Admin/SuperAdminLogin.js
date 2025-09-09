document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('SuperAdminLoginForm');
    
    if (!form) {
        console.error('Form not found! Check the form ID.');
        return;
    }
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const username = form.username.value;
        const password = form.password.value;
        
        console.log('Attempting login with:', { username }); // Debug log

        const response = await fetch('http://localhost:3000/super-admin-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Server response:', data); // Debug log

        if (data.success) {
            alert('Super Admin Login Successful!');
            // Comment out redirect temporarily for testing
            // window.location.href = './super-admin-dashboard.html';
        } else {
            alert(`Login Failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Server error. Please try again later.');
    }
});
});