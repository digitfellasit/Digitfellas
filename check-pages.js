const { getPool } = require('./lib/db');

async function checkPages() {
    const pool = getPool();
    try {
        const res = await pool.query('SELECT id, title, slug, is_published FROM cms_pages');
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkPages();
