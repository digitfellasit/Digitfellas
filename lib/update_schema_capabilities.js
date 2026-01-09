const { getPool } = require('./db');

async function migrate() {
    const pool = getPool();
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
    }
}

migrate().then(() => process.exit(0));
