require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import the cors package
const { Pool } = require('pg');

// Initialize the app and PostgreSQL connection
const app = express();
app.use(express.json());

// CORS setup
const allowedOrigins = ['https://vijayofficiaul.github.io']; // Your GitHub Pages URL
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true // If you need to support credentials like cookies
}));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // For secure connection
    }
});

// Route to submit a new idea
app.post('/ideas', async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO ideas (content) VALUES ($1) RETURNING *',
            [content]
        );
        res.status(201).json(result.rows[0]);  // Send the created idea as the response
    } catch (error) {
        console.error('Error saving idea:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all ideas
app.get('/ideas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ideas');
        res.json(result.rows);  // Send the list of ideas as the response
    } catch (error) {
        console.error('Error retrieving ideas:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
