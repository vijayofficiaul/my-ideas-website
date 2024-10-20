const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 10000;

// Use CORS with specific origin
const allowedOrigins = ['https://vijayofficiaul.github.io']; // Add your frontend URL here
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true // If you want to support credentials
}));

app.use(bodyParser.json());

// PostgreSQL connection setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// API endpoints
app.get('/ideas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ideas');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/ideas', async (req, res) => {
    const { content } = req.body;
    try {
        const result = await pool.query('INSERT INTO ideas (content) VALUES ($1) RETURNING *', [content]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
