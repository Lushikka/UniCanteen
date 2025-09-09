const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());

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

app.post('/admin-login', async (req, res) => {
    console.log('Login attempt received:', req.body); // Debug log
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM admin WHERE username = $1 AND password = $2',
            [username, password]
        );
        console.log('Query result:', result.rows); // Debug log

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// ...existing code...

// Add new endpoint for super admin login
app.post('/super-admin-login', async (req, res) => {
    console.log('Super admin login attempt:', req.body); // Debug log

    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM super_admin WHERE username = $1 AND password = $2',
            [username, password]
        );
        
        console.log('Query result:', result.rows); // Debug log

        if (result.rows.length > 0) {
            res.json({ 
                success: true, 
                message: 'Super admin login successful'
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Invalid super admin credentials'
            });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
});