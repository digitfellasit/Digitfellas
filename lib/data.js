
import { getPool } from '@/lib/db'

export async function getHomeData() {
  // If no DB configured, return empty prop structure to allow build to pass
  if (!process.env.DATABASE_URL) {
    console.warn('WARN: DATABASE_URL not set. Returning empty home data.')
    return { hero: {}, services: [], projects: [], posts: [] }
  }

  const pool = getPool()

  const [heroRes, servicesRes, projectsRes, blogRes, expRes, hwwRes, partnersRes, clientLogosRes] = await Promise.allSettled([
    // 1. Hero (Home)
    pool.query(`
      SELECT h.*, 
             json_agg(DISTINCT jsonb_build_object('id', hm.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', hm.variant)) FILTER (WHERE hm.id IS NOT NULL) as media,
             json_agg(DISTINCT jsonb_build_object('id', hb.id, 'text', hb.text, 'icon', hb.icon, 'sort_order', hb.sort_order)) FILTER (WHERE hb.id IS NOT NULL) as bullets
      FROM hero_sections h
      LEFT JOIN hero_media hm ON h.id = hm.hero_id
      LEFT JOIN media_items mi ON hm.media_id = mi.id
      LEFT JOIN hero_bullets hb ON h.id = hb.hero_id
      WHERE h.page_key = $1
      GROUP BY h.id
    `, ['home']),

    // 2. Services
    pool.query(`
      SELECT s.*, c.name as category_name,
             json_agg(DISTINCT jsonb_build_object('id', si.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', si.variant)) FILTER (WHERE si.id IS NOT NULL) as images,
             (
                SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                FROM media_items fmi WHERE fmi.id = s.featured_image_id
             ) as featured_image
      FROM services s
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN service_images si ON s.id = si.service_id
      LEFT JOIN media_items mi ON si.media_id = mi.id
      WHERE s.deleted_at IS NULL AND s.is_published = true
      GROUP BY s.id, c.name
      ORDER BY s.sort_order, s.created_at DESC
      LIMIT 6
    `),

    // 3. Projects
    pool.query(`
      SELECT p.*, c.name as category_name,
             json_agg(DISTINCT jsonb_build_object('id', pi.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', pi.variant)) FILTER (WHERE pi.id IS NOT NULL) as images,
             (
                SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                FROM media_items fmi WHERE fmi.id = p.featured_image_id
             ) as featured_image
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN project_images pi ON p.id = pi.project_id
      LEFT JOIN media_items mi ON pi.media_id = mi.id
      WHERE p.deleted_at IS NULL AND p.is_published = true
      GROUP BY p.id, c.name
      ORDER BY p.sort_order, p.created_at DESC
      LIMIT 6
    `),

    // 4. Blog Posts
    pool.query(`
      SELECT bp.*, c.name as category_name, u.email as author_email,
             json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL) as tags
      FROM blog_posts bp
      LEFT JOIN categories c ON bp.category_id = c.id
      LEFT JOIN df_users u ON bp.author_id = u.id
      LEFT JOIN blog_post_tags bpt ON bp.id = bpt.blog_post_id
      LEFT JOIN tags t ON bpt.tag_id = t.id
      WHERE bp.deleted_at IS NULL AND bp.is_published = true
      GROUP BY bp.id, c.name, u.email
      ORDER BY bp.published_at DESC, bp.created_at DESC
      LIMIT 4
    `),

    // 5. Experience Section
    pool.query('SELECT * FROM experience_sections LIMIT 1'),

    // 6. How We Work Section
    pool.query('SELECT * FROM how_we_work_sections LIMIT 1'),

    // 7. Partnerships Section
    pool.query('SELECT * FROM partnerships_sections LIMIT 1'),

    // 8. Client Logos (Marquee)
    pool.query(`
      SELECT id, name, logo_url, website_url, sort_order
      FROM client_logos
      WHERE is_published = true
      ORDER BY sort_order ASC, created_at DESC
    `)
  ])

  // Extract data from results
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
