
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' }); // Try .env.local first
if (!process.env.DATABASE_URL) require('dotenv').config();

async function checkColumns() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found");
        return;
    }
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const res = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'services';
        `);
        console.log("Columns in services table:", res.rows.map(r => r.column_name));
    } catch (e) {
        console.error("Check failed:", e);
    } finally {
        await pool.end();
    }
}

checkColumns();
