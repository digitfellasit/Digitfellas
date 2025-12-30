const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://root:6tITiMVbnYLnRc3jqd48DvTsD5X5xFsJ@dpg-d57pa56uk2gs73d6kdm0-a.oregon-postgres.render.com/digitfellas';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkColumns() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
    `);
        console.log('Projects columns:', res.rows.map(r => r.column_name).join(', '));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

checkColumns();
