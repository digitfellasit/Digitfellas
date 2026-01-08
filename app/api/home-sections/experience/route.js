import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    const pool = getPool()
    try {
        const res = await pool.query('SELECT * FROM experience_sections LIMIT 1')
        return NextResponse.json(res.rows[0] || {})
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(req) {
    const pool = getPool()
    try {
        const body = await req.json()
        const { title, description_1, description_2, principles, years_count, years_label, image_url } = body

        // Update the single row (we assume only one row for home page section)
        // We update the first row found or insert if empty (though seeding should have handled this)
        const checkRes = await pool.query('SELECT id FROM experience_sections LIMIT 1')

        if (checkRes.rows.length > 0) {
            const id = checkRes.rows[0].id
            const updateRes = await pool.query(`
        UPDATE experience_sections 
        SET title = $1, description_1 = $2, description_2 = $3, principles = $4, years_count = $5, years_label = $6, image_url = $7, image_alt = $8, updated_at = NOW()
        WHERE id = $9
        RETURNING *
      `, [title, description_1, description_2, JSON.stringify(principles), years_count, years_label, image_url, body.image_alt || '', id])
            return NextResponse.json(updateRes.rows[0])
        } else {
            const insertRes = await pool.query(`
        INSERT INTO experience_sections (title, description_1, description_2, principles, years_count, years_label, image_url, image_alt)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [title, description_1, description_2, JSON.stringify(principles), years_count, years_label, image_url, body.image_alt || ''])
            return NextResponse.json(insertRes.rows[0])
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
