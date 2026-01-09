import { Pool } from 'pg';

const DATABASE_URL = "postgresql://postgres.vdzpkucmaeasgjgfzezz:Digitfellas@123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function migrate() {
    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Adding faq and template columns to services table...');

        await pool.query(`
            ALTER TABLE services 
            ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS template VARCHAR(100) DEFAULT 'default';
        `);

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
