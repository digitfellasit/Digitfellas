
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is not defined');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkServices() {
    try {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT title, short_description FROM services ORDER BY sort_order');
            console.log(JSON.stringify(res.rows, null, 2));
        } finally {
            client.release();
        }
    } catch (e) {
        console.error('Error querying database:', e.message);
    } finally {
        await pool.end();
    }
}

checkServices();
