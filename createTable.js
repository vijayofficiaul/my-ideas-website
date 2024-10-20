require('dotenv').config(); // Load environment variables from .env
const { Pool } = require('pg');

// Create a new pool to connect to the database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false  // Important for cloud-hosted PostgreSQL services
    }
});

// Function to create the 'ideas' table
const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS ideas (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL
        );
    `;
    
    try {
        await pool.query(query);
        console.log('Table "ideas" created successfully.');
    } catch (error) {
        console.error('Error creating table:', error.message);
    } finally {
        pool.end(); // Close the connection
    }
};

// Run the createTable function
createTable();
