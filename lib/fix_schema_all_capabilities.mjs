import { Pool } from 'pg';

// Using the correct connection string from .env
const DATABASE_URL = "postgresql://postgres.vdzpkucmaeasgjgfzezz:Digitfellas%40123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

// Note: I URL-encoded the @ in the password (Digitfellas@123 -> Digitfellas%40123) 
// to ensure the connection string parser handles it correctly if the library is strict.
// However, to be absolutely sure, let's try the exact string first, or handle connection errors.
// Actually, 'pg' client often parses it robustly, but let's separate config to be safe.

const config = {
    connectionString: "postgresql://postgres.vdzpkucmaeasgjgfzezz:Digitfellas%40123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
    ssl: { rejectUnauthorized: false } // Required for Supabase/AWS usually
};

async function migrate() {
    const pool = new Pool(config);

    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Connected successfully.');
        client.release();

        console.log('Ensuring all Capabilities columns exist in services table...');

        // 1. CTA Columns
        await pool.query(`
            ALTER TABLE services 
            ADD COLUMN IF NOT EXISTS cta_title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS cta_description TEXT,
            ADD COLUMN IF NOT EXISTS cta_button_text VARCHAR(255),
            ADD COLUMN IF NOT EXISTS cta_link VARCHAR(255);
        `);
        console.log('- Verified CTA columns.');

        // 2. Features Grid Header Columns
        await pool.query(`
            ALTER TABLE services 
            ADD COLUMN IF NOT EXISTS features_title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS features_description TEXT;
        `);
        console.log('- Verified Features Header columns.');

        console.log('Migration completed successfully.');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await pool.end();
    }
}

migrate();
