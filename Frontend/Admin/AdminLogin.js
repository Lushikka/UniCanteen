// script.js
document.getElementById('adminLoginForm').addEventListener('submit', function(e){
    e.preventDefault();
    // For demo: just alert. In production, add authentication logic.
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var rememberMe = document.getElementById('remember').checked;
    alert('Username: ' + username + '\nPassword: ' + password + '\nRemember Me: ' + rememberMe);
});
