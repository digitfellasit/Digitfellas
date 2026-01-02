// Verify tables
import { getPool } from './lib/db.js'

async function checkTables() {
    const pool = getPool()
    try {
        const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
        console.log('Tables in database:', res.rows.map(r => r.table_name).join(', '))
    } catch (e) {
        console.error(e)
    } finally {
        pool.end()
    }
}
checkTables()
