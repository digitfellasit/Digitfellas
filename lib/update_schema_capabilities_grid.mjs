import { Pool } from 'pg';

const DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/digitfellas_db";

async function migrate() {
    const pool = new Pool({
        connectionString: DATABASE_URL,
    });

    try {
        console.log('Adding Features Header columns to services table...');

        await pool.query(`
            ALTER TABLE services 
            ADD COLUMN IF NOT EXISTS features_title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS features_description TEXT;
        `);

        console.log('Successfully added Features Header columns.');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
