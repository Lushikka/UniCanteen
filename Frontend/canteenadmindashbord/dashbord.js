document.addEventListener('DOMContentLoaded', () => {
    const API = (typeof window !== 'undefined' && window.API_BASE) ? String(window.API_BASE).replace(/\/$/, '') : 'http://localhost:3000';
    loadMenuItems();
    const addButton = document.querySelector('.add-btn');
    let modalContainer;
     const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear all session storage
            sessionStorage.clear();

            // Redirect to login page
            window.location.href = '../adminlogin.html'; // adjust path if needed
        });
    }

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

    // Handle form submission from iframe
    function handleFormSubmission(event) {
        // Check origin for security
        console.log('Message received:', event.data);
        
        if (event.data.type === 'formSubmission') {
            const formData = event.data.formData;
            console.log('Processing form data:', formData);

            fetch(`${API}/add-menu-item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Menu item added successfully!');
                    closeModal();
                    window.location.reload();
                } else {
                    throw new Error(data.message || 'Failed to add item');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add menu item: ' + error.message);
            });
        }
    }

    // Add button click handler
    addButton.addEventListener('click', () => {
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
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';

        // Add message event listener
        window.addEventListener('message', handleFormSubmission);
    });

    // Close modal function
    window.closeModal = function() {
        if (modalContainer) {
            modalContainer.style.display = 'none';
            modalContainer.innerHTML = '';
            window.removeEventListener('message', handleFormSubmission);
        }
    };

    // Close modal when clicking outside
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    
    // Initialize stats counters
    const stats = {
        totalItems: document.getElementById('totalItems'),
        availableItems: document.getElementById('availableItems'),
        unavailableItems: document.getElementById('unavailableItems')
    };

    async function loadMenuItems() {
        try {
            const response = await fetch(`${API}/menu-items`);
            const data = await response.json();
            
            if (data.success) {
                renderMenuItems(data.items);
                updateStats(data.stats);
            }
        } catch (error) {
            console.error('Error loading menu items:', error);
        }
    }

    function updateStats(statsData) {
        stats.totalItems.textContent = statsData.total;
        stats.availableItems.textContent = statsData.available;
        stats.unavailableItems.textContent = statsData.unavailable;
    }

    // Handle form submission from iframe
    window.handleFormSubmission = async function(formData) {
        try {
            const response = await fetch(`${API}/add-menu-item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                closeModal();
                loadMenuItems(); // Refresh the list
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Toggle item visibility
    window.toggleItemVisibility = async function(id) {
        try {
            const response = await fetch(`${API}/menu-items/${id}/toggle`, {
                method: 'PATCH'
            });
            
            if (response.ok) {
                loadMenuItems(); // Refresh the list
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    // Delete item
    window.deleteMenuItem = async function(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`${API}/menu-items/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    loadMenuItems(); // Refresh the list
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    // Render menu items table
    function renderMenuItems(items) {
        const tbody = document.querySelector('#menuItemsTable tbody');
        tbody.innerHTML = items.map(item => `
            <tr data-id="${item.id}">
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>Rs. ${item.price}</td>
                <td>${item.type}</td>
                <td>
                    <span class="status-badge ${item.available ? 'available' : 'unavailable'}">
                        ${item.available ? 'Available' : 'Unavailable'}
                    </span>
                </td>
                <td class="actions">
                    <button onclick="editMenuItem(${item.id})" class="action-btn edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="toggleItemVisibility(${item.id})" class="action-btn visibility">
                        <i class="fas fa-${item.available ? 'eye' : 'eye-slash'}"></i>
                    </button>
                    <button onclick="deleteMenuItem(${item.id})" class="action-btn delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
});





});
