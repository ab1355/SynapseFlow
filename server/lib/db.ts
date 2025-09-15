
// server/lib/db.ts

/**
 * This module handles the database connection and initial schema setup.
 * It uses the \'pg\' library to create a connection pool to a PostgreSQL-compatible
 * database (like TiDB Serverless).
 */

import { Pool } from 'pg';

// 1. DATABASE CONNECTION
// ------------------------

// Create a new connection pool. The pool will read the connection details
// (user, host, database, password, port) from environment variables, or from
// the DATABASE_URL environment variable.
// See: https://node-postgres.com/features/connecting
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        // TiDB Serverless requires a secure connection.
        // You might need to adjust this based on your specific provider.
        rejectUnauthorized: false 
    }
});

/**
 * Executes a SQL query against the database.
 * @param text The SQL query string.
 * @param params An array of parameters to pass to the query.
 * @returns The result of the query.
 */
export const query = (text: string, params: any[]) => pool.query(text, params);

// 2. INITIAL SCHEMA SETUP
// -------------------------

const VECTOR_DIMENSION = 1536; // Based on OpenAI's text-embedding-3-small model

/**
 * Creates the initial database tables required for the Vector-Enhanced Agent System.
 * This function is idempotent and can be safely run on every server startup.
 */
export const createInitialTables = async () => {
    try {
        console.log("Initializing database tables...");

        // Table for storing vector embeddings of individual tasks and ideas.
        await query(`
            CREATE TABLE IF NOT EXISTS task_embeddings (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL, -- Assuming a multi-user setup
                task_content TEXT NOT NULL,
                embedding VECTOR<FLOAT>(${VECTOR_DIMENSION}),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `, []);

        // Table for storing vector representations of successful workflow patterns.
        await query(`
            CREATE TABLE IF NOT EXISTS framework_pattern_embeddings (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                pattern_description TEXT NOT NULL,
                framework_combination TEXT[] NOT NULL, -- e.g., ['GTD', 'PARA']
                usage_count INT DEFAULT 1,
                embedding VECTOR<FLOAT>(${VECTOR_DIMENSION}),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `, []);

        // Table for storing vector representations of user energy/cognitive states.
        await query(`
            CREATE TABLE IF NOT EXISTS energy_state_context_vectors (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                context_name TEXT NOT NULL, -- e.g., 'low_energy_scattered'
                embedding VECTOR<FLOAT>(${VECTOR_DIMENSION}),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `, []);
        
        console.log("Database tables initialized successfully.");

    } catch (err) {
        console.error("Error initializing database tables:", err);
        // Exit the process if the database can't be initialized, as it's critical.
        process.exit(1);
    }
};
