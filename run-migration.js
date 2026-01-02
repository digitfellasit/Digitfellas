// Migration script to add short_description columns
import { getPool } from './lib/db.js'
import { readFileSync } from 'fs'
import { join } from 'path'

async function runMigration() {
    const pool = getPool()

    try {
        console.log('🔄 Running database migration...')

        // Read the migration SQL file
        const migrationPath = join(process.cwd(), 'lib', 'add_short_description.sql')
        const migrationSQL = readFileSync(migrationPath, 'utf8')

        // Execute the migration
        await pool.query(migrationSQL)

        console.log('✅ Migration completed successfully!')
        console.log('   - Added short_description to services table')
        console.log('   - Added short_description to projects table')
        console.log('   - Added service_id to projects table')
        console.log('   - Added short_description to blog_posts table')
        console.log('   - Created index on projects.service_id')

        // Verify the columns were added
        const checkQuery = `
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_name IN ('services', 'projects', 'blog_posts') 
        AND column_name IN ('short_description', 'service_id')
      ORDER BY table_name, column_name;
    `

        const result = await pool.query(checkQuery)
        console.log('\n📋 Verification - New columns added:')
        result.rows.forEach(row => {
            console.log(`   ✓ ${row.table_name}.${row.column_name}`)
        })

    } catch (error) {
        console.error('❌ Migration failed:', error.message)
        console.error('   This might be expected if the columns already exist.')
        console.error('   Error details:', error)
    } finally {
        await pool.end()
        process.exit(0)
    }
}

runMigration()
