import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Consolidated endpoint to fetch all homepage data in one request
export async function GET() {
    try {
        const pool = getPool()

        // Fetch all homepage data in parallel
        const [clientLogos, testimonials, techStack, processSteps] = await Promise.all([
            // Client Logos
            pool.query(`
        SELECT id, name, logo_url, website_url, sort_order
        FROM client_logos
        WHERE is_published = true
        ORDER BY sort_order ASC, created_at DESC
      `),

            // Testimonials
            pool.query(`
        SELECT id, client_name, client_role, client_company, 
               client_image_url, rating, testimonial_text, is_featured, sort_order
        FROM testimonials
        WHERE is_published = true
        ORDER BY is_featured DESC, sort_order ASC, created_at DESC
      `),

            // Tech Stack
            pool.query(`
        SELECT id, name, icon_url, category, website_url, sort_order
        FROM tech_stack
        WHERE is_published = true
        ORDER BY sort_order ASC, created_at DESC
      `),

            // Process Steps
            pool.query(`
        SELECT id, step_number, title, description, icon_name, sort_order
        FROM process_steps
        WHERE is_published = true
        ORDER BY step_number ASC, sort_order ASC
      `)
        ])

        return NextResponse.json({
            clientLogos: clientLogos.rows,
            testimonials: testimonials.rows,
            techStack: techStack.rows,
            processSteps: processSteps.rows
        })

    } catch (error) {
        console.error('Homepage data fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch homepage data' },
            { status: 500 }
        )
    }
}
