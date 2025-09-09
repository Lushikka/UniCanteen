// script.js
document.getElementById('adminLoginForm').addEventListener('submit', function(e){
    e.preventDefault();
    // For demo: just alert. In production, add authentication logic.
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var rememberMe = document.getElementById('remember').checked;
    //alert('Username: ' + username + '\nPassword: ' + password + '\nRemember Me: ' + rememberMe);
    // Simple demo authentication
    if(username === "admin" && password === "1111"){
        // Redirect to dashboard page
        window.location.href = "MahagedaraDashboard.html"; 
    } 
    else if(username === "admin" && password === "2222"){
        // Redirect to dashboard page
        window.location.href = "MetaDashboard.html"; 
    } 
    else if(username === "admin" && password === "3333"){
        // Redirect to dashboard page
        window.location.href = "HalabojanDashboard.html"; 
    } 
    else {
        alert("Invalid username or password!");
    }
});
