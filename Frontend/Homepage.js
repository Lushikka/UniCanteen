// script.js
document.querySelectorAll('.view-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
        alert('Viewing menu for ' + this.parentElement.querySelector('.canteen-title').innerText.trim());
        // In production: redirect or open actual canteen page
    });
});
