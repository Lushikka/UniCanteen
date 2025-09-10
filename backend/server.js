const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());

// Database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'unicanteen',
    password: 'nilu',
    port: 5432,
});

// Test database connection
pool.connect((err, client, done) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

// ...existing code...

// Admin login endpoint
app.post('/admin-login', async (req, res) => {
    console.log('Admin login attempt:', req.body);
   
    const { username, password } = req.body;
       console.log('Login attempt:', username, password);

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    try {
        const result = await pool.query(
           'SELECT * FROM canteen_admins WHERE username = $1 AND password = $2',
            [username, password]
        );
        console.log('Query result:', result.rows);
        console.log('Login attempt username:', username, 'password:', password);
        console.log('Query result:', result.rows);



        if (result.rows.length > 0) {
            res.json({ 
                success: true, 
                message: 'Login successful',
                userData: {
                    id: result.rows[0].id,
                    username: result.rows[0].username,
                    canteenName: result.rows[0].canteen_name 
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error occurred during login',
            error: err.message
        });
    }
});

// Super admin login endpoint
app.post('/super-admin-login', async (req, res) => {
    console.log('Super admin login attempt:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM super_admin WHERE username = $1 AND password = $2',
            [username, password]
        );
        console.log('Query result:', result.rows);

        if (result.rows.length > 0) {
            res.json({ 
                success: true, 
                message: 'Super admin login successful',
                userData: {
                    id: result.rows[0].id,
                    username: result.rows[0].username
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid super admin credentials' 
            });
        }
    } catch (err) {
        console.error('Super admin login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error occurred during login',
            error: err.message
        });
    }
});

// ...existing code...

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// 404 handler - Route not found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// 500 handler - Server errors
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

// Add this with your other endpoints
app.post('/add-menu-item', async (req, res) => {
    const { name, description, price, type, available } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO menu_items (name, description, price, type, available) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, price, type, available]
        );

        res.json({
            success: true,
            message: 'Menu item added successfully',
            item: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to add menu item',
            error: err.message
        });
    }
});
// Add these new endpoints after existing code

// Get all menu items
app.get('/menu-items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM menu_items ORDER BY id DESC');
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN available = true THEN 1 END) as available,
                COUNT(CASE WHEN available = false THEN 1 END) as unavailable
            FROM menu_items
        `);
        
        res.json({
            success: true,
            items: result.rows,
            stats: stats.rows[0]
        });
    } catch (err) {
        console.error('Error fetching menu items:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update menu item
app.put('/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, type, available } = req.body;

    try {
        const result = await pool.query(
            `UPDATE menu_items 
             SET name = $1, description = $2, price = $3, type = $4, available = $5
             WHERE id = $6 RETURNING *`,
            [name, description, price, type, available, id]
        );

        if (result.rows.length > 0) {
            res.json({ success: true, item: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (err) {
        console.error('Error updating menu item:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Toggle item visibility
app.patch('/menu-items/:id/toggle', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'UPDATE menu_items SET available = NOT available WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length > 0) {
            res.json({ success: true, item: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (err) {
        console.error('Error toggling item visibility:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete menu item
app.delete('/menu-items/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM menu_items WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
    // ...existing code...

// Get single menu item
app.get('/menu-items/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM menu_items WHERE id = $1',
            [req.params.id]
        );
        
        if (result.rows.length > 0) {
            res.json({
                success: true,
                item: result.rows[0]
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update menu item
app.put('/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, type, available } = req.body;

    try {
        const result = await pool.query(
            `UPDATE menu_items 
             SET name = $1, description = $2, price = $3, type = $4, available = $5
             WHERE id = $6 RETURNING *`,
            [name, description, price, type, available, id]
        );
        
        if (result.rows.length > 0) {
            res.json({
                success: true,
                item: result.rows[0]
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
});