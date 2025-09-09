// script.js

document.querySelector('.logout-btn').addEventListener('click', function() {
   
    // redirect to login page
    window.location.href = "AdminLogin.html"; 
    
});

document.querySelector('.add-btn').addEventListener('click', function() {
   
    // In production: show add item form
    window.location.href = "MahagedaraAdd_form.html";
});

document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', function() {
        window.location.href = "MahagedaraEdit_form.html";
    });
});
document.querySelectorAll('.action-btn.hide').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Set item unavailable functionality');
    });
});
document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', function() {
        if(confirm('Are you sure you want to delete this item?')) {
            // Remove row in production
            alert('Item deleted.');
        }
    });
});
