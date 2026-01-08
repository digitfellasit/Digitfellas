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

async function applyIndexes() {
    if (!pool.options.connectionString) {
        console.error("DATABASE_URL not found in .env");
        return;
    }
    try {
        const sqlPath = path.join(__dirname, '..', 'lib', 'performance_indexes.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying indexes from:', sqlPath);
        await pool.query(sql);
        console.log('Successfully applied indexes!');
    } catch (err) {
        if (err.message && err.message.includes('already exists')) {
            console.log('Indexes likely already exist (ignoring duplicate error).');
        } else {
            console.error('Error applying indexes:', err);
        }
    } finally {
        pool.end();
    }
}

applyIndexes();
