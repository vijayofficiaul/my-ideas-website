require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Submit an Idea
app.post('/submit', async (req, res) => {
    console.log("📥 Received Data:", req.body);

    const { user_id, title, content } = req.body;
    if (!user_id || !title || !content) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO ideas (user_id, title, content, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
            [user_id, title, content]
        );
        console.log("✅ Idea Inserted:", result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("❌ Error inserting idea:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get All Pending Ideas
app.get('/ideas', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ideas WHERE status = 'pending'");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Approve an Idea
app.post('/review', async (req, res) => {
    const { idea_id, reviewer_id, review_comments } = req.body;
    try {
        await pool.query("UPDATE ideas SET status = 'approved' WHERE id = $1", [idea_id]);
        await pool.query(
            "INSERT INTO reviews (idea_id, reviewer_id, review_comments) VALUES ($1, $2, $3)",
            [idea_id, reviewer_id, review_comments]
        );
        res.json({ message: "✅ Idea approved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Fetch Published Ideas
app.get('/published', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ideas WHERE status = 'published'");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
