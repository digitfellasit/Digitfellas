import { getPool, pgEnabled } from '@/lib/db'

export async function getCaseStudyBySlug(slug) {
    if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
      SELECT cs.*, 
             (
               SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
               FROM media_items fmi WHERE fmi.id = cs.featured_image_id
             ) as featured_image
      FROM case_studies cs
      WHERE cs.slug = $1 AND cs.deleted_at IS NULL
    `, [slug])

        if (!result.rows[0]) return null

        // Increment view count
        await pool.query('UPDATE case_studies SET view_count = view_count + 1 WHERE id = $1', [result.rows[0].id])

        return result.rows[0]
    }
    return null
}

export async function getAllCaseStudySlugs() {
    if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query('SELECT slug FROM case_studies WHERE deleted_at IS NULL AND is_published = true')
        return result.rows.map(row => row.slug)
    }
    return []
}
