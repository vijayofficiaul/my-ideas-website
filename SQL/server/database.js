require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
});

pool.connect()
    .then(client => {
        console.log("✅ Connected to PostgreSQL successfully!");
        client.release();
    })
    .catch(err => console.error("❌ Database connection error:", err.message));

module.exports = { pool };
    