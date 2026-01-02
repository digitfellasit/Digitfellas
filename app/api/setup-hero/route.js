
import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const pool = getPool()

        // Check if table exists
        await pool.query('SELECT 1 FROM hero_sections LIMIT 1')

        const updateQuery = `
      INSERT INTO hero_sections (id, page_key, title, kicker, subtitle, primary_cta_label, primary_cta_url, background_type, is_active)
      VALUES (
        gen_random_uuid(),
        'home', 
        'Hello! We Are A Group Of | Skilled, Talented, Creative | Developers And Programmers.',
        'Avada Programmer',
        'We build digital products that help businesses grow. From simple websites to complex web applications, we deliver quality code provided by the best experts in the field.',
        'Learn about our services',
        '/services',
        'image',
        true
      )
      ON CONFLICT (page_key) DO UPDATE 
      SET 
        title = EXCLUDED.title,
        kicker = EXCLUDED.kicker,
        subtitle = EXCLUDED.subtitle,
        primary_cta_label = EXCLUDED.primary_cta_label,
        primary_cta_url = EXCLUDED.primary_cta_url,
        updated_at = NOW()
      RETURNING *;
    `
        const result = await pool.query(updateQuery)

        return NextResponse.json({
            ok: true,
            message: 'Updated Hero Content',
            hero: result.rows[0]
        })
    } catch (error) {
        console.error('Setup Hero Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
