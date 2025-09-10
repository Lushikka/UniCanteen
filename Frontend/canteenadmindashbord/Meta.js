document.addEventListener('DOMContentLoaded', () => {
    let modalContainer;

    // Initialize modal container
    function createModalContainer() {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modalContainer';
        modalContainer.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        `;
        document.body.appendChild(modalContainer);
    }

    createModalContainer();

    // Logout button handler
    document.querySelector('.logout-btn').addEventListener('click', () => {
        if(confirm('Are you sure you want to logout?')) {
            window.location.href = "AdminLogin.html";
        }
    });

    // Add button handler - Show popup instead of redirect
    document.querySelector('.add-btn').addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = 'MetaAdd_form.html';
        iframe.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            height: 600px;
            border: none;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            background: white;
            z-index: 1000;
        `;
        
        modalContainer.innerHTML = '';
        modalContainer.appendChild(iframe);
        modalContainer.style.display = 'flex';
    });

    // Edit button handler - Show popup instead of redirect
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const iframe = document.createElement('iframe');
            iframe.src = 'MetaEdit_form.html';
            iframe.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 500px;
                height: 600px;
                border: none;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                background: white;
                z-index: 1000;
            `;
            
            modalContainer.innerHTML = '';
            modalContainer.appendChild(iframe);
            modalContainer.style.display = 'flex';
        });
    });

    // Hide button handler
    document.querySelectorAll('.action-btn.hide').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('tr').dataset.id;
            if(confirm('Set this item as unavailable?')) {
                // Add API call to update availability
                alert('Item set as unavailable');
            }
        });
    });

    // Delete button handler
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('tr').dataset.id;
            if(confirm('Are you sure you want to delete this item?')) {
                // Add API call to delete item
                alert('Item deleted');
            }
        });
    });

    // Close modal function
    window.closeModal = function() {
        if (modalContainer) {
            modalContainer.style.display = 'none';
            modalContainer.innerHTML = '';
        }
    };

    // Close modal when clicking outside
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
    document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...

    // Edit button handler
    window.editMenuItem = async function(itemId) {
        try {
            const response = await fetch(`http://localhost:3000/menu-items/${itemId}`);
            const data = await response.json();
            
            if (data.success) {
                const iframe = document.createElement('iframe');
                iframe.src = 'MetaEdit_form.html';
                iframe.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 500px;
                    height: 600px;
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    background: white;
                    z-index: 1000;
                `;
                
                modalContainer.innerHTML = '';
                modalContainer.appendChild(iframe);
                modalContainer.style.display = 'flex';

                // Wait for iframe to load then send data
                iframe.onload = () => {
                    iframe.contentWindow.postMessage({
                        type: 'editItemData',
                        item: data.item
                    }, '*');
                };
            }
        } catch (error) {
            console.error('Error loading item data:', error);
        }
    };

    // Handle edit form submission
    window.addEventListener('message', async function(event) {
        if (event.data.type === 'editFormSubmission') {
            try {
                const response = await fetch(`http://localhost:3000/menu-items/${event.data.formData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(event.data.formData)
                });

                if (response.ok) {
                    closeModal();
                    loadMenuItems(); // Refresh the table
                } else {
                    throw new Error('Failed to update item');
                }
            } catch (error) {
                console.error('Error updating item:', error);
                alert('Failed to update item');
            }
        }
    });
});
});