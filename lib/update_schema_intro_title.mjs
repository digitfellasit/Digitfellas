
import { getPool } from './db.js';

async function fixSchema() {
    const pool = getPool();
    try {
        console.log("Checking and fixing schema for Capabilities...");

        // 1. Add intro_title column if missing
        await pool.query(`
            ALTER TABLE services 
            ADD COLUMN IF NOT EXISTS intro_title TEXT;
        `);
        console.log("Verified 'intro_title' column.");

        console.log("Schema update complete!");
    } catch (e) {
        console.error("Schema fix failed:", e);
    } finally {
        await pool.end();
    }
}

fixSchema();
