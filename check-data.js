const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://root:6tITiMVbnYLnRc3jqd48DvTsD5X5xFsJ@dpg-d57pa56uk2gs73d6kdm0-a.oregon-postgres.render.com/digitfellas';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkData() {
    try {
        const tables = ['categories', 'tags', 'navigation_items', 'hero_sections', 'services', 'projects', 'blog_posts'];

        console.log('📊 Database Counts:');
        for (const table of tables) {
            const res = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`  - ${table}: ${res.rows[0].count}`);
        }
    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        pool.end();
    }
}

checkData();
