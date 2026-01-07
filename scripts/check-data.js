const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function check() {
    try {
        console.log('Checking Hero Section...');
        const hero = await pool.query("SELECT id, page_key, heading FROM hero_sections WHERE page_key = 'home'");
        console.log('Hero rows:', hero.rows);

        if (hero.rows.length > 0) {
            const heroId = hero.rows[0].id;
            const media = await pool.query("SELECT * FROM hero_media WHERE hero_id = $1", [heroId]);
            console.log('Hero Media:', media.rows);
        }

        console.log('Checking Services...');
        const services = await pool.query("SELECT id, title, is_published, deleted_at FROM services WHERE is_published = true AND deleted_at IS NULL");
        console.log('Services count:', services.rowCount);
        console.log('Services rows:', services.rows.map(r => r.title));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

check();
