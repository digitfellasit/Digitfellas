import { Pool } from 'pg';

// Hardcode connection string for direct execution
const DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/digitfellas_db";

async function migrate() {
    const pool = new Pool({
        connectionString: DATABASE_URL,
    });

    try {
        console.log('Adding CTA columns to services table...');

        await pool.query(`
            ALTER TABLE services 
            ADD COLUMN IF NOT EXISTS cta_title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS cta_description TEXT,
            ADD COLUMN IF NOT EXISTS cta_button_text VARCHAR(255),
            ADD COLUMN IF NOT EXISTS cta_link VARCHAR(255) DEFAULT '/contact';
        `);

        console.log('Successfully added CTA columns.');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
