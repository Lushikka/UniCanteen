document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('SuperAdminLoginForm');
    
    if (!form) {
        handleError(new Error('Super admin form not found'), 'notFound');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const username = form.username.value;
            const password = form.password.value;

            const response = await fetch('http://localhost:3000/super-admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Store super admin data in sessionStorage
                sessionStorage.setItem('superAdminUser', JSON.stringify(data.userData));
                window.location.href = './super-admin-dashboard.html';
            } else {
                handleError(new Error(data.message), 'unauthorized');
            }
        } catch (error) {
            console.error('Super admin login error:', error);
            handleError(error, 'serverError');
        }
    });
});