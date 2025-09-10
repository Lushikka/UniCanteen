document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminLoginForm');

    if (!form) {
        handleError(new Error('Login form not found'), 'notFound');
        return;
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            handleError(new Error('Username and password are required'), 'unauthorized');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store admin data in session storage
                sessionStorage.setItem('canteenId', data.userData.id);
                sessionStorage.setItem('canteenName', data.userData.canteenName);
                sessionStorage.setItem('username', data.userData.username);

                // Redirect based on canteen name
                switch (data.userData.canteenName.toLowerCase()) {
                    case 'meta':
                        window.location.href = '../canteenadmindashbord/MetaDashboard.html';
                        break;
                    case 'mahagedara':
                        window.location.href = '../canteenadmindashbord/MahagedaraDashboard.html';
                        break;
                    case 'halabojan':
                        window.location.href = '../canteenadmindashbord/HalabojanDashboard.html';
                        break;
                    default:
                        handleError(new Error('Invalid canteen type'), 'unauthorized');
                }
            } else {
                handleError(new Error(data.message || 'Invalid credentials'), 'unauthorized');
            }
        } catch (error) {
            console.error('Login error:', error);
            handleError(error, 'serverError');
        }
    });

    // Username validation (_admin suffix)
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            if (value && !value.endsWith('_admin')) {
                e.target.setCustomValidity('Username must end with _admin');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }
});

// Error handler function
function handleError(error, errorType = 'default') {
    const errorMessages = {
        unauthorized: 'Invalid username or password',
        notFound: 'Login form not found',
        serverError: 'Server error occurred',
        default: error.message || 'An error occurred'
    };

    let errorElement = document.getElementById('error-message');
    if (!errorElement) {
        errorElement = createErrorElement();
    }

    errorElement.textContent = errorMessages[errorType] || errorMessages.default;
    errorElement.style.display = 'block';

    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

// Create error element if it doesn't exist
function createErrorElement() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'error-message';
    document.querySelector('.login-form').insertBefore(
        errorDiv, 
        document.querySelector('button[type="submit"]')
    );
    return errorDiv;
}
