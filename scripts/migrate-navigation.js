const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: (() => {
        try {
            const envPath = path.join(__dirname, '..', '.env');
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/DATABASE_URL=(.*)/);
            return match ? match[1].trim().replace(/(^"|"$)/g, '') : null;
        } catch (e) {
            console.error("Could not read .env file");
            return null;
        }
    })()
});

async function migrate() {
    if (!pool.options.connectionString) {
        console.error("DATABASE_URL not found in .env");
        return;
    }
    try {
        const sqlPath = path.join(__dirname, '..', 'lib', 'navigation_migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');
        await pool.query(sql);
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

migrate();
