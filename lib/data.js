
import { getPool } from '@/lib/db'

export async function getHomeData() {
  // If no DB configured, return empty prop structure to allow build to pass
  if (!process.env.DATABASE_URL) {
    console.warn('WARN: DATABASE_URL not set. Returning empty home data.')
    return { hero: {}, services: [], projects: [], posts: [] }
  }

  const pool = getPool()

  const [heroRes, servicesRes, projectsRes, blogRes, expRes, hwwRes, partnersRes, clientLogosRes] = await Promise.allSettled([
    // 1. Hero (Home) - Only essential fields
    pool.query(`
      SELECT h.id, h.heading as title, h.subheading as subtitle, h.kicker, h.cta_text as primary_cta_label, h.cta_url as primary_cta_url,
             json_agg(DISTINCT jsonb_build_object('id', hm.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', hm.variant)) FILTER (WHERE hm.id IS NOT NULL) as media,
             json_agg(DISTINCT jsonb_build_object('id', hb.id, 'text', hb.text, 'icon', hb.icon, 'sort_order', hb.sort_order)) FILTER (WHERE hb.id IS NOT NULL) as bullets
      FROM hero_sections h
      LEFT JOIN hero_media hm ON h.id = hm.hero_id
      LEFT JOIN media_items mi ON hm.media_id = mi.id
      LEFT JOIN hero_bullets hb ON h.id = hb.hero_id
      WHERE h.page_key = $1
      GROUP BY h.id
    `, ['home']),

    // 2. Services - Only preview fields, no full content
    pool.query(`
      SELECT s.id, s.title, s.slug, s.short_description, s.icon, s.sort_order,
             (
                 SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                 FROM media_items fmi WHERE fmi.id = s.featured_image_id
              ) as featured_image
      FROM services s
      WHERE s.deleted_at IS NULL AND s.is_published = true
      ORDER BY s.sort_order, s.created_at DESC
      LIMIT 6
    `),

    // 3. Projects - Only preview fields, no full content
    pool.query(`
      SELECT p.id, p.title, p.slug, p.short_description, p.client_name, p.sort_order,
             (
                 SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                 FROM media_items fmi WHERE fmi.id = p.featured_image_id
              ) as featured_image
      FROM projects p
      WHERE p.deleted_at IS NULL AND p.is_published = true
      ORDER BY p.sort_order, p.created_at DESC
      LIMIT 6
    `),

    // 4. Blog Posts - Only preview fields, no full content
    pool.query(`
      SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.published_at, bp.reading_time_minutes,
             (
                SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                FROM media_items fmi WHERE fmi.id = bp.featured_image_id
             ) as featured_image
      FROM blog_posts bp
      WHERE bp.deleted_at IS NULL AND bp.is_published = true
      ORDER BY bp.published_at DESC, bp.created_at DESC
      LIMIT 4
    `),

    // 5. Experience Section - Only display fields
    pool.query('SELECT id, title, description, years_count, projects_count, clients_count FROM experience_sections LIMIT 1'),

    // 6. How We Work Section - Only display fields
    pool.query('SELECT id, title, description FROM how_we_work_sections LIMIT 1'),

    // 7. Partnerships Section - Only display fields
    pool.query('SELECT id, title, description FROM partnerships_sections LIMIT 1'),

    // 8. Client Logos (Marquee) - Only essential fields
    pool.query(`
      SELECT id, name, logo_url, website_url, sort_order
      FROM client_logos
      WHERE is_published = true
      ORDER BY sort_order ASC, created_at DESC
      LIMIT 20
    `)
  ])

  // Extract data from results
  const hero = heroRes.status === 'fulfilled' ? (heroRes.value.rows[0] || {}) : {}
  const services = servicesRes.status === 'fulfilled' ? servicesRes.value.rows : []
  const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.rows : []
  const posts = blogRes.status === 'fulfilled' ? blogRes.value.rows : []

  // New Sections
  const experience = expRes.status === 'fulfilled' ? (expRes.value.rows[0] || {}) : {}
  const howWeWork = hwwRes.status === 'fulfilled' ? (hwwRes.value.rows[0] || {}) : {}
  const partnerships = partnersRes.status === 'fulfilled' ? (partnersRes.value.rows[0] || {}) : {}
  const clientLogos = clientLogosRes.status === 'fulfilled' ? clientLogosRes.value.rows : []

  return { hero, services, projects, posts, experience, howWeWork, partnerships, clientLogos }
}
