const { Pool } = require('pg');

async function checkServices() {
    if (!process.env.DATABASE_URL) {
        console.log('No DATABASE_URL found');
        return;
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const res = await pool.query("SELECT id, title, short_description FROM services WHERE deleted_at IS NULL");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Query failed:', err);
    } finally {
        await pool.end();
    }
}

checkServices();
