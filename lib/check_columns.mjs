
import { getPool } from './db.js';

async function checkColumns() {
    const pool = getPool();
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
