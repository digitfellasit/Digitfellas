const { Pool } = require('pg');

const descriptions = [
    { title: 'Digital Product Engineering', short: 'Web and mobile systems built to scale.' },
    { title: 'Commerce & Platform Engineering', short: 'Scalable commerce and enterprise platforms.' },
    { title: 'AI & Automation Engineering', short: 'Intelligent automation for real business workflows.' },
    { title: 'Security & Assurance', short: 'Software security, audits, and risk assurance.' }
];

async function migrate() {
    if (!process.env.DATABASE_URL) {
        console.log('No DATABASE_URL found');
        return;
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        for (const d of descriptions) {
            const res = await pool.query(
                "UPDATE services SET short_description = $1 WHERE title = $2 AND deleted_at IS NULL RETURNING id",
                [d.short, d.title]
            );
            if (res.rowCount > 0) {
                console.log(`Updated '${d.title}' with new description.`);
            } else {
                console.log(`Service '${d.title}' not found or already deleted.`);
            }
        }
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
