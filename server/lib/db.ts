
import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: parseInt(process.env.TIDB_PORT || '4000', 10),
    ssl: {
        rejectUnauthorized: false 
    }
});

export const query = (text: string, params: any[]) => pool.query(text, params);

const VECTOR_DIMENSION = 1536;

export const createInitialTables = async () => {
    try {
        console.log("Initializing database tables...");

        await query(`
            CREATE TABLE IF NOT EXISTS task_embeddings (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                task_content TEXT NOT NULL,
                embedding VECTOR<FLOAT>(${VECTOR_DIMENSION}),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `, []);

        await query(`
            CREATE TABLE IF NOT EXISTS framework_pattern_embeddings (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                pattern_description TEXT NOT NULL,
                framework_combination TEXT[] NOT NULL,
                usage_count INT DEFAULT 1,
                embedding VECTOR<FLOAT>(${VECTOR_DIMENSION}),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `, []);

        await query(`
            CREATE TABLE IF NOT EXISTS energy_state_context_vectors (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                context_name TEXT NOT NULL,
                embedding VECTOR<FLOAT>(${VECTOR_DIMENSION}),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `, []);
        
        console.log("Database tables initialized successfully.");

    } catch (err) {
        console.error("Error initializing database tables:", err);
        process.exit(1);
    }
};
