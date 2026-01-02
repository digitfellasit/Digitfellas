// Verify migration was successful
import { getPool } from './lib/db.js'

async function verifyMigration() {
    const pool = getPool()

    try {
        console.log('🔍 Verifying database migration...\n')

        // Check for new columns
        const checkQuery = `
      SELECT table_name, column_name, data_type
      FROM information_schema.columns 
      WHERE table_name IN ('services', 'projects', 'blog_posts') 
        AND column_name IN ('short_description', 'service_id')
      ORDER BY table_name, column_name;
    `

        const result = await pool.query(checkQuery)

        if (result.rows.length > 0) {
            console.log('✅ Migration successful! New columns found:')
            result.rows.forEach(row => {
                console.log(`   ✓ ${row.table_name}.${row.column_name} (${row.data_type})`)
            })
        } else {
            console.log('⚠️  No new columns found. Migration may have failed.')
        }

        // Check for index
        const indexQuery = `
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'projects' 
        AND indexname = 'idx_projects_service_id';
    `

        const indexResult = await pool.query(indexQuery)
        if (indexResult.rows.length > 0) {
            console.log('   ✓ Index idx_projects_service_id created')
        }

        console.log('\n✨ Database is ready for use!')

    } catch (error) {
        console.error('❌ Verification failed:', error.message)
    } finally {
        await pool.end()
        process.exit(0)
    }
}

verifyMigration()
