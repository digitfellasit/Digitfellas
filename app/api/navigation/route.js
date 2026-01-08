import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    const pool = getPool()
    try {
        const { rows } = await pool.query('SELECT * FROM navigation_items ORDER BY sort_order ASC')
        return NextResponse.json(rows)
    } catch (error) {
        console.error('Failed to fetch navigation:', error)
        return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 })
    }
}

export async function POST(req) {
    const pool = getPool()
    try {
        const body = await req.json()
        const { label, url, type, parent_id, sort_order, is_active } = body

        // Simple validation
        if (!label) return NextResponse.json({ error: 'Label is required' }, { status: 400 })

        const res = await pool.query(
            `INSERT INTO navigation_items (label, url, type, parent_id, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [label, url, type || 'link', parent_id || null, sort_order || 0, is_active ?? true]
        )

        return NextResponse.json(res.rows[0])
    } catch (error) {
        console.error('Failed to create navigation item:', error)
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
    }
}

export async function PUT(req) {
    const pool = getPool()
    try {
        const body = await req.json()
        const { id, label, url, type, parent_id, sort_order, is_active } = body

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

        const res = await pool.query(
            `UPDATE navigation_items 
             SET label = $1, url = $2, type = $3, parent_id = $4, sort_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [label, url, type, parent_id || null, sort_order, is_active, id]
        )

        return NextResponse.json(res.rows[0])
    } catch (error) {
        console.error('Failed to update navigation item:', error)
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }
}

export async function DELETE(req) {
    const pool = getPool()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    try {
        await pool.query('DELETE FROM navigation_items WHERE id = $1', [id])
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete navigation item:', error)
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
    }
}
