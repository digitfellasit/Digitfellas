import { getPool, pgEnabled } from '@/lib/db'

export async function getBlogPostBySlug(slug) {
    if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
      SELECT bp.*, c.name as category_name, u.email as author_email,
             (
               SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
               FROM media_items fmi WHERE fmi.id = bp.featured_image_id
             ) as featured_image,
             json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL) as tags
      FROM blog_posts bp
      LEFT JOIN categories c ON bp.category_id = c.id
      LEFT JOIN df_users u ON bp.author_id = u.id
      LEFT JOIN blog_post_tags bpt ON bp.id = bpt.blog_post_id
      LEFT JOIN tags t ON bpt.tag_id = t.id
      WHERE bp.slug = $1 AND bp.deleted_at IS NULL AND bp.is_published = true
      GROUP BY bp.id, c.name, u.email
    `, [slug])

        if (!result.rows[0]) return null

        // Increment view count (optional for SSG, but maybe good for ISR)
        await pool.query('UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1', [result.rows[0].id])

        return result.rows[0]
    }
    return null
}

export async function getAllBlogSlugs() {
    if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query('SELECT slug FROM blog_posts WHERE deleted_at IS NULL AND is_published = true')
        return result.rows.map(row => row.slug)
    }
    return []
}
