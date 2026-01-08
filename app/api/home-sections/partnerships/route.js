import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    const pool = getPool()
    try {
        const res = await pool.query('SELECT * FROM partnerships_sections LIMIT 1')
        return NextResponse.json(res.rows[0] || {})
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(req) {
    const pool = getPool()
    try {
        const body = await req.json()
        const { title, description } = body

        const checkRes = await pool.query('SELECT id FROM partnerships_sections LIMIT 1')

        if (checkRes.rows.length > 0) {
            const id = checkRes.rows[0].id
            const updateRes = await pool.query(`
        UPDATE partnerships_sections 
        SET title = $1, description = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `, [title, description, id])
            return NextResponse.json(updateRes.rows[0])
        } else {
            const insertRes = await pool.query(`
        INSERT INTO partnerships_sections (title, description)
        VALUES ($1, $2)
        RETURNING *
      `, [title, description])
            return NextResponse.json(insertRes.rows[0])
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
