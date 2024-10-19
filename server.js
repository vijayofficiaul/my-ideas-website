const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up the PostgreSQL pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(bodyParser.json());

// Endpoint to handle idea submissions
app.post('/submit', async (req, res) => {
    const { idea } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO ideas (content) VALUES ($1) RETURNING id',
            [idea]
        );
        res.json({ message: 'Idea submitted successfully!' });
    } catch (error) {
        console.error('Error inserting idea:', error);
        res.status(500).json({ error: 'Failed to submit idea.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
