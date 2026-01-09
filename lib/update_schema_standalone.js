
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function getEnv(key) {
    if (process.env[key]) return process.env[key];
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const match = content.match(new RegExp(`^${key}=(.*)`, 'm'));
            if (match) return match[1].trim();
        }
    } catch (e) { }
    return null;
}

async function run() {
    const connectionString = getEnv('DATABASE_URL');
    if (!connectionString) {
        console.error("DATABASE_URL not found in environment or .env file");
        return;
    }

    console.log("Connecting to DB...");
    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Adding intro_title column...");
        await pool.query(`
            ALTER TABLE services 
            ADD COLUMN IF NOT EXISTS intro_title TEXT;
        `);
        console.log("Success: intro_title column added (if not exists).");

        // Verification
        const res = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'services' AND column_name = 'intro_title';
        `);
        if (res.rows.length > 0) {
            console.log("Verification Passed: intro_title column exists.");
        } else {
            console.error("Verification Failed: intro_title column NOT found.");
        }

    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await pool.end();
    }
}

run();
