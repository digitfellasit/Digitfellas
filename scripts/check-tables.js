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
            return null;
        }
    })()
});

async function checkTables() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
        console.log('Tables:', res.rows.map(r => r.table_name));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

checkTables();
