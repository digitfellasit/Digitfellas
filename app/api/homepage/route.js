// API endpoints for homepage redesign content types
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getPool } from '@/lib/db'

function handleCORS(response) {
    response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
}

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
    return handleCORS(new NextResponse(null, { status: 200 }))
}

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    try {
        const pool = getPool()

        switch (type) {
            case 'client-logos':
                const logos = await pool.query(`
          SELECT * FROM client_logos 
          WHERE is_published = true 
          ORDER BY sort_order, created_at
        `)
                return handleCORS(NextResponse.json(logos.rows))

            case 'testimonials':
                const testimonials = await pool.query(`
          SELECT * FROM testimonials 
          WHERE is_published = true 
          ORDER BY is_featured DESC, sort_order, created_at DESC
        `)
                return handleCORS(NextResponse.json(testimonials.rows))

            case 'tech-stack':
                const techStack = await pool.query(`
          SELECT * FROM tech_stack 
          WHERE is_published = true 
          ORDER BY category, sort_order, name
        `)
                return handleCORS(NextResponse.json(techStack.rows))

            case 'process-steps':
                const steps = await pool.query(`
          SELECT * FROM process_steps 
          WHERE is_published = true 
          ORDER BY step_number, sort_order
        `)
                return handleCORS(NextResponse.json(steps.rows))

            default:
                return handleCORS(NextResponse.json({ error: 'Invalid type' }, { status: 400 }))
        }
    } catch (error) {
        console.error('Homepage API error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
    }
}

export async function POST(request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const body = await request.json()

    try {
        const pool = getPool()
        const id = uuidv4()

        switch (type) {
            case 'client-logos':
                const logo = await pool.query(`
          INSERT INTO client_logos (id, name, logo_url, website_url, sort_order, is_published)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `, [id, body.name, body.logo_url, body.website_url, body.sort_order || 0, body.is_published !== false])
                return handleCORS(NextResponse.json(logo.rows[0]))

            case 'testimonials':
                const testimonial = await pool.query(`
          INSERT INTO testimonials (id, client_name, client_role, client_company, client_image_url, rating, testimonial_text, is_featured, is_published, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `, [id, body.client_name, body.client_role, body.client_company, body.client_image_url, body.rating || 5, body.testimonial_text, body.is_featured || false, body.is_published !== false, body.sort_order || 0])
                return handleCORS(NextResponse.json(testimonial.rows[0]))

            case 'tech-stack':
                const tech = await pool.query(`
          INSERT INTO tech_stack (id, name, icon_url, category, website_url, sort_order, is_published)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `, [id, body.name, body.icon_url, body.category, body.website_url, body.sort_order || 0, body.is_published !== false])
                return handleCORS(NextResponse.json(tech.rows[0]))

            case 'process-steps':
                const step = await pool.query(`
          INSERT INTO process_steps (id, step_number, title, description, icon_name, sort_order, is_published)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `, [id, body.step_number, body.title, body.description, body.icon_name, body.sort_order || 0, body.is_published !== false])
                return handleCORS(NextResponse.json(step.rows[0]))

            default:
                return handleCORS(NextResponse.json({ error: 'Invalid type' }, { status: 400 }))
        }
    } catch (error) {
        console.error('Homepage API POST error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
    }
}

export async function PUT(request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')
    const body = await request.json()

    try {
        const pool = getPool()

        switch (type) {
            case 'client-logos':
                const logo = await pool.query(`
          UPDATE client_logos 
          SET name = $1, logo_url = $2, website_url = $3, sort_order = $4, is_published = $5
          WHERE id = $6
          RETURNING *
        `, [body.name, body.logo_url, body.website_url, body.sort_order, body.is_published, id])
                return handleCORS(NextResponse.json(logo.rows[0]))

            case 'testimonials':
                const testimonial = await pool.query(`
          UPDATE testimonials 
          SET client_name = $1, client_role = $2, client_company = $3, client_image_url = $4, 
              rating = $5, testimonial_text = $6, is_featured = $7, is_published = $8, sort_order = $9
          WHERE id = $10
          RETURNING *
        `, [body.client_name, body.client_role, body.client_company, body.client_image_url, body.rating, body.testimonial_text, body.is_featured, body.is_published, body.sort_order, id])
                return handleCORS(NextResponse.json(testimonial.rows[0]))

            case 'tech-stack':
                const tech = await pool.query(`
          UPDATE tech_stack 
          SET name = $1, icon_url = $2, category = $3, website_url = $4, sort_order = $5, is_published = $6
          WHERE id = $7
          RETURNING *
        `, [body.name, body.icon_url, body.category, body.website_url, body.sort_order, body.is_published, id])
                return handleCORS(NextResponse.json(tech.rows[0]))

            case 'process-steps':
                const step = await pool.query(`
          UPDATE process_steps 
          SET step_number = $1, title = $2, description = $3, icon_name = $4, sort_order = $5, is_published = $6
          WHERE id = $7
          RETURNING *
        `, [body.step_number, body.title, body.description, body.icon_name, body.sort_order, body.is_published, id])
                return handleCORS(NextResponse.json(step.rows[0]))

            default:
                return handleCORS(NextResponse.json({ error: 'Invalid type' }, { status: 400 }))
        }
    } catch (error) {
        console.error('Homepage API PUT error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    try {
        const pool = getPool()

        const table = {
            'client-logos': 'client_logos',
            'testimonials': 'testimonials',
            'tech-stack': 'tech_stack',
            'process-steps': 'process_steps'
        }[type]

        if (!table) {
            return handleCORS(NextResponse.json({ error: 'Invalid type' }, { status: 400 }))
        }

        await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id])
        return handleCORS(NextResponse.json({ success: true }))
    } catch (error) {
        console.error('Homepage API DELETE error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
    }
}
