import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export async function GET() {
    try {
        const pool = getPool()

        // Add new columns to services table
        await pool.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS hero_data JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS intro_content TEXT,
      ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS details_sections JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS details_section JSONB DEFAULT '{}';
    `)

        return NextResponse.json({ ok: true, message: 'Services schema updated successfully' })
    } catch (error) {
        console.error('Schema update failed:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
