import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    const pool = getPool()
    try {
        const res = await pool.query('SELECT * FROM how_we_work_sections LIMIT 1')
        return NextResponse.json(res.rows[0] || {})
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(req) {
    const pool = getPool()
    try {
        const body = await req.json()
        const { title, subtitle, pillars, cta_text, cta_link } = body

        const checkRes = await pool.query('SELECT id FROM how_we_work_sections LIMIT 1')

        if (checkRes.rows.length > 0) {
            const id = checkRes.rows[0].id
            const updateRes = await pool.query(`
        UPDATE how_we_work_sections 
        SET title = $1, subtitle = $2, pillars = $3, cta_text = $4, cta_link = $5, updated_at = NOW()
        WHERE id = $6
        RETURNING *
      `, [title, subtitle, JSON.stringify(pillars), cta_text, cta_link, id])
            return NextResponse.json(updateRes.rows[0])
        } else {
            // Fallback insert
            const insertRes = await pool.query(`
        INSERT INTO how_we_work_sections (title, subtitle, pillars, cta_text, cta_link)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [title, subtitle, JSON.stringify(pillars), cta_text, cta_link])
            return NextResponse.json(insertRes.rows[0])
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
