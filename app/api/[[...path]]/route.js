import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { ensureSchema, getPool } from '@/lib/db'

export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), 'data')
const SITE_FILE = path.join(DATA_DIR, 'site.json')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    if (e?.code === 'ENOENT') return fallback
    throw e
  }
}

async function writeJsonAtomic(filePath, data) {
  await ensureDir(path.dirname(filePath))
  const tmp = `${filePath}.${Date.now()}.tmp`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
  try {
    await fs.rename(tmp, filePath)
  } catch (e) {
    // Fallback for edge filesystem cases
    if (e?.code === 'EXDEV' || e?.code === 'ENOENT' || e?.code === 'EPERM') {
      const raw = await fs.readFile(tmp)
      await fs.writeFile(filePath, raw)
      await fs.unlink(tmp).catch(() => { })
      return
    }
    throw e
  }
}

function stableNowISO() {
  return new Date().toISOString().slice(0, 10)
}

function defaultSite() {
  return {
    brand: { name: 'Digitfellas' },
    navigation: {
      items: [
        { id: uuidv4(), label: 'Home', href: '/' },
        { id: uuidv4(), label: 'About', href: '/about' },
        { id: uuidv4(), label: 'Capabilities', href: '/capabilities' },
        { id: uuidv4(), label: 'Projects', href: '/projects' },
        { id: uuidv4(), label: 'Blog', href: '/blog' },
        { id: uuidv4(), label: 'Contact', href: '/contact' },
      ],
      cta: { label: 'Get a quote', href: '/contact' },
    },
    home: {
      hero: {
        kicker: 'Digitfellas • IT Solutions LLP',
        title: 'We craft modern software for modern businesses.',
        subtitle:
          'Product engineering, web development, automation, and cloud-ready solutions—designed to move fast without breaking things.',
        primaryCta: { label: 'Start a project', href: '/contact' },
        secondaryCta: { label: 'Explore services', href: '/services' },
        bullets: [
          { id: uuidv4(), text: 'Web apps • Dashboards • Portals' },
          { id: uuidv4(), text: 'Automation & Integrations' },
          { id: uuidv4(), text: 'Performance, security & reliability focus' },
        ],
        stats: [
          { id: uuidv4(), value: '7+ yrs', label: 'Delivery experience' },
          { id: uuidv4(), value: '24/7', label: 'Support mindset' },
          { id: uuidv4(), value: 'Fast', label: 'Execution' },
        ],
        mediaLabel: 'Digitfellas',
        media: {
          desktop: [{ id: uuidv4(), type: 'image', url: '/uploads/placeholder-hero.jpg', alt: 'Digitfellas hero' }],
          mobile: [{ id: uuidv4(), type: 'image', url: '/uploads/placeholder-hero.jpg', alt: 'Digitfellas hero mobile' }],
        },
      },
      services: {
        eyebrow: 'Services',
        title: 'Everything you need to build, ship, and scale.',
        subtitle: 'From UI engineering to backend systems and automation — delivered end-to-end.',
        items: [
          {
            id: uuidv4(),
            slug: 'web-development',
            title: 'Web Development',
            description: 'High-performance websites, portals, and web apps with modern UX.',
            tag: 'Frontend + Backend',
            meta: 'Next.js / Node / APIs',
            href: '/services/web-development',
            images: { desktop: [], mobile: [] },
          },
          {
            id: uuidv4(),
            slug: 'automation',
            title: 'Automation & Integrations',
            description: 'Connect tools, reduce manual work, and ship reliable workflows.',
            tag: 'Automation',
            meta: 'APIs / Webhooks / ETL',
            href: '/services/automation',
            images: { desktop: [], mobile: [] },
          },
          {
            id: uuidv4(),
            slug: 'cloud-devops',
            title: 'Cloud & DevOps',
            description: 'Deployment pipelines, monitoring, and scalable infrastructure.',
            tag: 'DevOps',
            meta: 'CI/CD / Observability',
            href: '/services/cloud-devops',
            images: { desktop: [], mobile: [] },
          },
        ],
      },
      projects: {
        eyebrow: 'Projects',
        title: 'A selection of builds.',
        subtitle: 'Case studies, internal tools, and product work.',
        items: [
          {
            id: uuidv4(),
            title: 'Operations Dashboard',
            description: 'KPI dashboard with role-based access and export workflows.',
            category: 'Dashboard',
            link: '/projects',
            images: { desktop: [{ id: uuidv4(), url: '/uploads/placeholder-project.jpg', alt: 'Project' }], mobile: [] },
          },
          {
            id: uuidv4(),
            title: 'Lead Management CRM',
            description: 'Pipeline, follow-ups, and automation to accelerate sales.',
            category: 'CRM',
            link: '/projects',
            images: { desktop: [{ id: uuidv4(), url: '/uploads/placeholder-project.jpg', alt: 'Project' }], mobile: [] },
          },
          {
            id: uuidv4(),
            title: 'Service Booking Platform',
            description: 'Scheduling, payments-ready flows, and admin control.',
            category: 'Platform',
            link: '/projects',
            images: { desktop: [{ id: uuidv4(), url: '/uploads/placeholder-project.jpg', alt: 'Project' }], mobile: [] },
          },
        ],
      },
      blog: {
        eyebrow: 'Blog',
        title: 'Notes for builders.',
        subtitle: 'Short reads about product engineering and delivery.',
        items: [
          {
            id: uuidv4(),
            slug: 'shipping-fast-with-quality',
            title: 'Shipping fast without losing quality',
            excerpt: 'Practical ways to keep speed high while maintaining reliability.',
            date: stableNowISO(),
            content:
              '# Shipping fast without losing quality\n\nSpeed and quality are not enemies. They need a process: small batches, good feedback loops, and strong defaults.',
            featured: [{ id: uuidv4(), url: '/uploads/placeholder-blog.jpg', alt: 'Blog cover' }],
          },
        ],
      },
      testimonials: {
        eyebrow: 'Testimonials',
        title: 'Teams trust Digitfellas.',
        subtitle: 'A few words from partners and clients.',
        items: [
          {
            id: uuidv4(),
            name: 'Client Partner',
            role: 'Operations',
            quote: 'Digitfellas delivered a clean dashboard experience and helped us automate the boring parts.',
          },
        ],
      },
      logos: {
        title: 'Partners',
        items: [
          { id: uuidv4(), label: 'Partner One', url: '/uploads/placeholder-logo.svg' },
          { id: uuidv4(), label: 'Partner Two', url: '/uploads/placeholder-logo.svg' },
        ],
      },
    },
    pages: {
      about: {
        title: 'About Digitfellas',
        content:
          'Digitfellas IT Solutions LLP is a professional IT organization delivering modern web development, automation, and scalable systems for teams that want to move fast.',
        media: { desktop: [], mobile: [] },
      },
      contact: {
        title: 'Contact',
        subtitle: 'Tell us what you want to build. We respond quickly.',
        form: { enabled: true },
      },
    },
    footer: {
      tagline: 'Professional IT solutions for modern teams.',
      contact: {
        email: 'info@digitfellas.com',
        phone: '+91',
        address: 'India',
      },
      socials: [
        { id: uuidv4(), label: 'LinkedIn', href: 'https://linkedin.com' },
        { id: uuidv4(), label: 'Facebook', href: 'https://facebook.com' },
        { id: uuidv4(), label: 'WhatsApp', href: 'https://wa.me/1234567890' },
      ],
    },
    head_scripts: '',
    _meta: { updatedAt: new Date().toISOString() },
  }
}

function getSecret() {
  // IMPORTANT: Set AUTH_SECRET (or JWT_SECRET) in env for production.
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || 'dev-insecure-secret'
}

function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, s, 120000, 32, 'sha256').toString('hex')
  return { salt: s, hash }
}

function verifyPassword(password, salt, hash) {
  const derived = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'))
}

function signSession(payloadObj) {
  const secret = getSecret()
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

function verifySession(token) {
  try {
    if (!token) return null
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return null
    const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
    const obj = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (obj?.exp && Date.now() > obj.exp) return null
    return obj
  } catch {
    return null
  }
}

function getCookie(request, name) {
  const cookie = request.headers.get('cookie') || ''
  const parts = cookie.split(';').map((p) => p.trim())
  const hit = parts.find((p) => p.startsWith(`${name}=`))
  if (!hit) return null
  return decodeURIComponent(hit.substring(name.length + 1))
}

function setCookie(response, name, value, opts = {}) {
  const maxAge = opts.maxAge ?? 60 * 60 * 24 * 7
  const cookie = `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
  response.headers.append('Set-Cookie', cookie)
}

function clearCookie(response, name) {
  response.headers.append('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
}

function requireAdmin(request) {
  const token = getCookie(request, 'df_session')
  const session = verifySession(token)
  if (!session?.userId) return null
  return session
}

async function pgEnabled() {
  return !!process.env.DATABASE_URL
}

async function pgEnsureSeed() {
  await ensureSchema()
  const pool = getPool()

  // Seed site if empty
  const siteRes = await pool.query('SELECT id, data FROM df_site ORDER BY updated_at DESC LIMIT 1')
  if (!siteRes?.rows?.length) {
    const id = uuidv4()
    await pool.query('INSERT INTO df_site (id, data) VALUES ($1, $2)', [id, defaultSite()])
  }

  // Seed admin user if missing
  const email = 'admin@digitfellas.com'
  const userRes = await pool.query('SELECT id FROM df_users WHERE lower(email)=lower($1) LIMIT 1', [email])
  if (!userRes?.rows?.length) {
    const password = 'admin123'
    const { salt, hash } = hashPassword(password)
    await pool.query('INSERT INTO df_users (id, email, salt, hash, role, name) VALUES ($1, $2, $3, $4, $5, $6)', [
      uuidv4(),
      email,
      salt,
      hash,
      'admin',
      'Administrator'
    ])
  }
}

async function pgGetSite() {
  await pgEnsureSeed()
  const pool = getPool()
  const res = await pool.query('SELECT data FROM df_site ORDER BY updated_at DESC LIMIT 1')
  return res?.rows?.[0]?.data || defaultSite()
}

async function pgSetSite(nextSite) {
  await pgEnsureSeed()
  const pool = getPool()
  const res = await pool.query('SELECT id FROM df_site ORDER BY updated_at DESC LIMIT 1')
  const id = res?.rows?.[0]?.id
  const finalSite = { ...(nextSite || {}), _meta: { ...(nextSite?._meta || {}), updatedAt: new Date().toISOString() } }
  if (id) {
    await pool.query('UPDATE df_site SET data=$1, updated_at=now() WHERE id=$2', [finalSite, id])
  } else {
    await pool.query('INSERT INTO df_site (id, data) VALUES ($1, $2)', [uuidv4(), finalSite])
  }
  return finalSite
}

async function pgLogin(email, password) {
  await pgEnsureSeed()
  const pool = getPool()
  const res = await pool.query('SELECT id, email, salt, hash, role, name FROM df_users WHERE lower(email)=lower($1) LIMIT 1', [
    email,
  ])
  const user = res?.rows?.[0]
  if (!user) return null
  const ok = verifyPassword(password, user.salt, user.hash)
  if (!ok) return null
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

async function pgUpdateProfile(userId, data) {
  const pool = getPool()
  const updates = []
  const values = []
  let idx = 1

  if (data.name !== undefined) {
    updates.push(`name = $${idx++}`)
    values.push(data.name)
  }
  if (data.email !== undefined) {
    updates.push(`email = $${idx++}`)
    values.push(data.email)
  }
  if (data.password) {
    const { salt, hash } = hashPassword(data.password)
    updates.push(`salt = $${idx++}, hash = $${idx++}`)
    values.push(salt, hash)
  }

  if (updates.length > 0) {
    values.push(userId)
    try {
      await pool.query(`UPDATE df_users SET ${updates.join(', ')} WHERE id = $${idx}`, values)
    } catch (err) {
      if (err.code === '23505') { // Unique violation
        throw new Error('Email already in use')
      }
      throw err
    }
  }
}

// JSON fallback (kept for safety)
async function jsonGetSite() {
  const site = await readJson(SITE_FILE, null)
  if (site) return site
  const seeded = defaultSite()
  await writeJsonAtomic(SITE_FILE, seeded)
  return seeded
}

async function jsonSetSite(nextSite) {
  const finalSite = { ...(nextSite || {}), _meta: { ...(nextSite?._meta || {}), updatedAt: new Date().toISOString() } }
  await writeJsonAtomic(SITE_FILE, finalSite)
  return finalSite
}

async function jsonGetUsers() {
  const users = await readJson(USERS_FILE, null)
  if (users) return users
  const email = 'admin@digitfellas.com'
  const password = 'admin123'
  const { salt, hash } = hashPassword(password)
  const seeded = {
    users: [{ id: uuidv4(), email, salt, hash, role: 'admin', createdAt: new Date().toISOString() }],
    _seed: { email, passwordHint: 'Change in /data/users.json later', createdAt: new Date().toISOString() },
  }
  await writeJsonAtomic(USERS_FILE, seeded)
  return seeded
}

async function handleUpload(request) {
  try {
    const form = await request.formData()

    const files = form.getAll('files')
    const kind = form.get('kind') || 'image'
    const variant = form.get('variant') || 'desktop'

    if (!files?.length) {
      return handleCORS(NextResponse.json({ error: 'No files provided (field name: files)' }, { status: 400 }))
    }

    // Check if we're in production (Vercel) or development
    const isProduction = process.env.VERCEL === '1'
    const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN

    const saved = []
    for (const f of files) {
      const originalName = f.name || 'upload'
      const ext = path.extname(originalName) || (kind === 'video' ? '.mp4' : '.jpg')
      const safeBase = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 64)
      const filename = `${Date.now()}_${uuidv4()}_${variant}_${safeBase}${ext}`

      let finalUrl = ''
      let sizeBytes = 0

      // Use Vercel Blob in production if token is available
      if (isProduction && hasBlob) {
        try {
          const blob = await put(`uploads/${filename}`, f, {
            access: 'public',
          })
          finalUrl = blob.url
          sizeBytes = f.size || 0
        } catch (blobError) {
          console.error('Blob upload failed:', blobError)
          throw new Error(`Blob upload failed: ${blobError.message}`)
        }
      } else {
        // Use local file system in development
        await ensureDir(UPLOAD_DIR).catch(err => {
          console.warn('Failed to ensure upload directory:', err.message)
        })

        const arrayBuffer = await f.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const diskPath = path.join(UPLOAD_DIR, filename)

        try {
          await fs.writeFile(diskPath, buffer)
          finalUrl = `/uploads/${filename}`
          sizeBytes = buffer.length
        } catch (err) {
          console.error('Disk write failed:', err.message)
          throw new Error(`Failed to save file: ${err.message}`)
        }
      }

      const mediaId = uuidv4()
      const mimeType = kind === 'video' ? 'video/mp4' : (ext === '.png' ? 'image/png' : 'image/jpeg')

      // Insert into DB
      if (await pgEnabled()) {
        const pool = getPool()
        await pool.query(`
              INSERT INTO media_items (id, url, filename, alt_text, mime_type, size_bytes)
              VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (id) DO NOTHING
        `, [mediaId, finalUrl, filename, '', mimeType, sizeBytes])
      }

      saved.push({ id: mediaId, url: finalUrl, originalName, kind, variant, size: sizeBytes })
    }

    return handleCORS(NextResponse.json({ uploaded: saved }))
  } catch (err) {
    console.error('Unexpected upload handler error:', err)
    return handleCORS(NextResponse.json({ error: 'Internal server error during upload path processing', details: err.message }, { status: 500 }))
  }
}
async function handleRoute(request, { params }) {
  const { path: parts = [] } = params
  const route = `/${parts.join('/')}`
  const method = request.method

  if (await pgEnabled()) {
    await ensureSchema()
  }

  try {
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(
        NextResponse.json({
          ok: true,
          name: 'Digitfellas dynamic site API',
          storage: (await pgEnabled()) ? 'postgres' : 'json',
        })
      )
    }

    // Auth
    if (route === '/auth/me' && method === 'GET') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ user: null }))

      let user = { id: session.userId, email: session.email, role: session.role }
      if (await pgEnabled()) {
        const pool = getPool()
        const res = await pool.query('SELECT id, email, name, role FROM df_users WHERE id = $1', [session.userId])
        if (res.rows[0]) user = res.rows[0]
      }

      return handleCORS(NextResponse.json({ user }))
    }

    if (route === '/auth/me' && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      if (await pgEnabled()) {
        await pgUpdateProfile(session.userId, body)
        return handleCORS(NextResponse.json({ ok: true }))
      }
      return handleCORS(NextResponse.json({ error: 'DB not enabled' }, { status: 500 }))
    }

    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const email = (body?.email || '').toLowerCase().trim()
      const password = body?.password || ''
      if (!email || !password) {
        return handleCORS(NextResponse.json({ error: 'email and password required' }, { status: 400 }))
      }

      let user = null
      if (await pgEnabled()) {
        user = await pgLogin(email, password)
      } else {
        const usersObj = await jsonGetUsers()
        const hit = (usersObj?.users || []).find((u) => (u?.email || '').toLowerCase() === email)
        if (hit && verifyPassword(password, hit.salt, hit.hash)) user = { id: hit.id, email: hit.email, role: hit.role }
      }

      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }))
      }

      const token = signSession({
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
      })

      const res = NextResponse.json({ ok: true, user })
      setCookie(res, 'df_session', token)
      return handleCORS(res)
    }

    if (route === '/auth/logout' && method === 'POST') {
      const res = NextResponse.json({ ok: true })
      clearCookie(res, 'df_session')
      return handleCORS(res)
    }

    // Uploads (admin)
    if (route === '/uploads') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      if (method === 'POST') {
        return await handleUpload(request)
      }

      if (method === 'PUT') {
        try {
          const body = await request.json()
          const { url, alt } = body

          if (!url) return handleCORS(NextResponse.json({ error: 'URL required' }, { status: 400 }))

          if (await pgEnabled()) {
            const pool = getPool()
            await pool.query('UPDATE media_items SET alt_text = $1 WHERE url = $2', [alt || '', url])
            return handleCORS(NextResponse.json({ ok: true }))
          }
          return handleCORS(NextResponse.json({ ok: true })) // JSON mode fallback (no-op or handled via entity)
        } catch (e) {
          console.error("Failed to update media metadata", e)
          return handleCORS(NextResponse.json({ error: 'Update failed' }, { status: 500 }))
        }
      }
    }

    // Site
    if (route === '/site' && method === 'GET') {
      const site = (await pgEnabled()) ? await pgGetSite() : await jsonGetSite()
      return handleCORS(NextResponse.json(site))
    }

    if (route === '/site' && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const body = await request.json()
      const saved = (await pgEnabled()) ? await pgSetSite(body) : await jsonSetSite(body)
      return handleCORS(NextResponse.json(saved))
    }

    // Settings (maps to footer.contact in site data)
    if (route === '/settings' && method === 'GET') {
      const site = (await pgEnabled()) ? await pgGetSite() : await jsonGetSite()
      return handleCORS(NextResponse.json({
        brand_name: site?.brand?.name || '',
        brand_tagline: site?.footer?.tagline || '',
        contact_email: site?.footer?.contact?.email || '',
        contact_phone: site?.footer?.contact?.phone || '',
        contact_address: site?.footer?.contact?.address || '',
        social_facebook: site?.footer?.socials?.find(s => s.label === 'Facebook')?.href || '',
        social_twitter: site?.footer?.socials?.find(s => s.label === 'Twitter')?.href || '',
        social_linkedin: site?.footer?.socials?.find(s => s.label === 'LinkedIn')?.href || '',
        social_instagram: site?.footer?.socials?.find(s => s.label === 'Instagram')?.href || '',
        social_whatsapp: site?.footer?.socials?.find(s => s.label === 'WhatsApp')?.href || '',
        footer_text: site?.footer?.copyright || '',
        seo_default_title: site?.brand?.name || '',
        seo_default_description: site?.footer?.tagline || '',
        analytics_id: site?.analytics_id || '',
        head_scripts: site?.head_scripts || '',
      }))
    }

    if (route === '/settings' && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const settings = await request.json()

      // Fetch current site data
      const site = (await pgEnabled()) ? await pgGetSite() : await jsonGetSite()

      // Update site with settings
      const updatedSite = {
        ...site,
        brand: {
          ...site?.brand,
          name: settings.brand_name
        },
        footer: {
          ...site?.footer,
          tagline: settings.brand_tagline,
          copyright: settings.footer_text,
          contact: {
            email: settings.contact_email,
            phone: settings.contact_phone,
            address: settings.contact_address
          },
          socials: [
            { id: 'fb', label: 'Facebook', href: settings.social_facebook },
            { id: 'tw', label: 'Twitter', href: settings.social_twitter },
            { id: 'li', label: 'LinkedIn', href: settings.social_linkedin },
            { id: 'ig', label: 'Instagram', href: settings.social_instagram },
            { id: 'wa', label: 'WhatsApp', href: settings.social_whatsapp },
          ].filter(s => s.href)
        },
        analytics_id: settings.analytics_id,
        head_scripts: settings.head_scripts
      }

      const saved = (await pgEnabled()) ? await pgSetSite(updatedSite) : await jsonSetSite(updatedSite)
      revalidatePath('/', 'layout')
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // CAPABILITIES (SERVICES) CRUD
    // ============================================
    if ((route === '/services' || route === '/capabilities') && method === 'GET') {
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT s.*, c.name as category_name,
                 json_agg(DISTINCT jsonb_build_object('id', si.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', si.variant)) FILTER (WHERE si.id IS NOT NULL) as images,
                 (
                   SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                   FROM media_items fmi WHERE fmi.id = s.featured_image_id
                 ) as featured_image,
                 (
                   SELECT row_to_json(h_row) FROM (
                     SELECT h.*, (
                        SELECT json_agg(json_build_object('url', m.url, 'variant', hm.variant, 'type', m.mime_type))
                        FROM hero_media hm JOIN media_items m ON hm.media_id = m.id
                        WHERE hm.hero_id = h.id
                     ) as media
                     FROM hero_sections h WHERE h.id = s.hero_section_id
                   ) h_row
                 ) as hero
          FROM services s
          LEFT JOIN categories c ON s.category_id = c.id
          LEFT JOIN service_images si ON s.id = si.service_id
          LEFT JOIN media_items mi ON si.media_id = mi.id
          WHERE s.deleted_at IS NULL ${requireAdmin(request) ? '' : 'AND s.is_published = true'}
          GROUP BY s.id, c.name
          ORDER BY s.sort_order ASC, s.created_at DESC
        `)
        return handleCORS(NextResponse.json(result.rows))
      } else {
        const site = await jsonGetSite()
        return handleCORS(NextResponse.json(site?.home?.services?.items || []))
      }
    }

    if ((route.match(/^\/services\/[^/]+$/) || route.match(/^\/capabilities\/[^/]+$/)) && method === 'GET') {
      const slug = parts[1]
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
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
          WHERE s.slug = $1 AND s.deleted_at IS NULL
          GROUP BY s.id, c.name
        `, [slug])
        if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Service not found' }, { status: 404 }))
        return handleCORS(NextResponse.json(result.rows[0]))
      }
      return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
    }

    if ((route === '/services' || route === '/capabilities') && method === 'POST') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      const pool = getPool()
      const id = uuidv4()
      let heroSectionId = null

      const result = await pool.query(`
        INSERT INTO services (id, title, slug, description, short_description, content, excerpt, icon_url, category_id, meta_title, meta_description, is_featured, is_published, published_at, sort_order, featured_image_id, hero_data, intro_content, features, details_sections, faq, template, cta_title, cta_description, cta_button_text, cta_link, features_title, features_description, intro_title)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
        RETURNING *
      `, [id, body.title, body.slug, body.description || '', body.short_description || '', body.content || '', body.excerpt || '', body.icon_url || '', body.category_id || null, body.meta_title || '', body.meta_description || '', body.is_featured || false, body.is_published !== false, body.is_published ? new Date() : null, body.sort_order || 0, body.featured_image_id || null, JSON.stringify(body.hero_data || {}), body.intro_content || '', JSON.stringify(body.features || []), JSON.stringify(body.details_sections || []), JSON.stringify(body.faq || []), body.template || 'default', body.cta_title || '', body.cta_description || '', body.cta_button_text || '', body.cta_link || '', body.features_title || '', body.features_description || '', body.intro_title || ''])

      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if ((route.match(/^\/services\/[^/]+$/) || route.match(/^\/capabilities\/[^/]+$/)) && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const body = await request.json()
      const pool = getPool()

      const result = await pool.query(`
        UPDATE services 
        SET title = $1, slug = $2, description = $3, short_description = $4, content = $5, excerpt = $6, icon_url = $7, 
            category_id = $8, meta_title = $9, meta_description = $10, is_featured = $11, is_published = $12, published_at = $13, sort_order = $14, featured_image_id = $16,
            hero_data = $17, intro_content = $18, features = $19, details_sections = $20, faq = $21, template = $22,
            cta_title = $23, cta_description = $24, cta_button_text = $25, cta_link = $26,
            features_title = $27, features_description = $28, intro_title = $29
        WHERE id = $15 AND deleted_at IS NULL
        RETURNING *
      `, [body.title, body.slug, body.description || '', body.short_description || '', body.content || '', body.excerpt || '', body.icon_url || '', body.category_id || null, body.meta_title || '', body.meta_description || '', body.is_featured || false, body.is_published !== false, body.is_published && !body.published_at ? new Date() : body.published_at, body.sort_order || 0, id, body.featured_image_id || null, JSON.stringify(body.hero_data || {}), body.intro_content || '', JSON.stringify(body.features || []), JSON.stringify(body.details_sections || []), JSON.stringify(body.faq || []), body.template || 'default', body.cta_title || '', body.cta_description || '', body.cta_button_text || '', body.cta_link || '', body.features_title || '', body.features_description || '', body.intro_title || ''])

      if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Capability not found' }, { status: 404 }))
      revalidatePath('/services')
      revalidatePath('/capabilities')
      if (result.rows[0]?.slug) {
        revalidatePath(`/services/${result.rows[0].slug}`)
        revalidatePath(`/capabilities/${result.rows[0].slug}`)
      }
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if ((route.match(/^\/services\/[^/]+$/) || route.match(/^\/capabilities\/[^/]+$/)) && method === 'DELETE') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const pool = getPool()
      await pool.query('UPDATE services SET deleted_at = NOW() WHERE id = $1', [id])
      revalidatePath('/services')
      revalidatePath('/capabilities')
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // PROJECTS CRUD
    // ============================================
    if (route === '/projects' && method === 'GET') {
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT p.*, c.name as category_name,
                 json_agg(DISTINCT jsonb_build_object('id', pi.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', pi.variant)) FILTER (WHERE pi.id IS NOT NULL) as images,
                 (
                   SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                   FROM media_items fmi WHERE fmi.id = p.featured_image_id
                 ) as featured_image,
                 json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL) as tags,
                 (
                   SELECT row_to_json(h_row) FROM (
                     SELECT h.*, (
                        SELECT json_agg(json_build_object('url', m.url, 'variant', hm.variant, 'type', m.mime_type))
                        FROM hero_media hm JOIN media_items m ON hm.media_id = m.id
                        WHERE hm.hero_id = h.id
                     ) as media
                     FROM hero_sections h WHERE h.id = p.hero_section_id
                   ) h_row
                 ) as hero
          FROM projects p
          LEFT JOIN categories c ON p.category_id = c.id
          LEFT JOIN project_images pi ON p.id = pi.project_id
          LEFT JOIN media_items mi ON pi.media_id = mi.id
          LEFT JOIN project_tags pt ON p.id = pt.project_id
          LEFT JOIN tags t ON pt.tag_id = t.id
          WHERE p.deleted_at IS NULL ${requireAdmin(request) ? '' : 'AND p.is_published = true'}
          GROUP BY p.id, c.name
          ORDER BY p.sort_order ASC, p.created_at DESC
        `)
        return handleCORS(NextResponse.json(result.rows))
      } else {
        const site = await jsonGetSite()
        return handleCORS(NextResponse.json(site?.home?.projects?.items || []))
      }
    }

    if (route.match(/^\/projects\/[^/]+$/) && method === 'GET') {
      const slug = parts[1]
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT p.*, c.name as category_name,
                 json_agg(DISTINCT jsonb_build_object('id', pi.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', pi.variant)) FILTER (WHERE pi.id IS NOT NULL) as images,
                 json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL) as tags,
                 (
                   SELECT row_to_json(h_row) FROM (
                     SELECT h.*, (
                        SELECT json_agg(json_build_object('url', m.url, 'variant', hm.variant, 'type', m.mime_type))
                        FROM hero_media hm JOIN media_items m ON hm.media_id = m.id
                        WHERE hm.hero_id = h.id
                     ) as media
                     FROM hero_sections h WHERE h.id = p.hero_section_id
                   ) h_row
                 ) as hero
          FROM projects p
          LEFT JOIN categories c ON p.category_id = c.id
          LEFT JOIN project_images pi ON p.id = pi.project_id
          LEFT JOIN media_items mi ON pi.media_id = mi.id
          LEFT JOIN project_tags pt ON p.id = pt.project_id
          LEFT JOIN tags t ON pt.tag_id = t.id
          WHERE p.slug = $1 AND p.deleted_at IS NULL
          GROUP BY p.id, c.name
        `, [slug])
        if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Project not found' }, { status: 404 }))
        return handleCORS(NextResponse.json(result.rows[0]))
      }
      return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
    }

    if (route === '/projects' && method === 'POST') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      const pool = getPool()
      const id = uuidv4()

      let heroSectionId = null
      if (body.hero) {
        heroSectionId = await upsertHero(pool, body.hero, `project-${body.slug}`)
      }

      const result = await pool.query(`
        INSERT INTO projects (id, title, slug, description, short_description, content, excerpt, client_name, project_url, service_id, category_id, meta_title, meta_description, is_featured, is_published, completed_at, sort_order, hero_section_id, featured_image_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `, [id, body.title, body.slug, body.description, body.short_description, body.content, body.excerpt, body.client_name, body.project_url, body.service_id, body.category_id, body.meta_title, body.meta_description, body.is_featured || false, body.is_published !== false, body.completed_at, body.sort_order || 0, heroSectionId, body.featured_image_id || null])

      revalidatePath('/projects')
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/projects\/[^/]+$/) && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const body = await request.json()
      const pool = getPool()

      let heroSectionId = null
      if (body.hero) {
        const current = await pool.query('SELECT hero_section_id FROM projects WHERE id = $1', [id])
        const existingId = current.rows[0]?.hero_section_id
        heroSectionId = await upsertHero(pool, body.hero, `project-${body.slug}`, existingId)
      }

      const result = await pool.query(`
        UPDATE projects 
        SET title = $1, slug = $2, description = $3, short_description = $4, content = $5, excerpt = $6, client_name = $7, 
            project_url = $8, service_id = $9, category_id = $10, meta_title = $11, meta_description = $12, is_featured = $13, is_published = $14, completed_at = $15, sort_order = $16, hero_section_id = COALESCE($18, hero_section_id), featured_image_id = $19
        WHERE id = $17 AND deleted_at IS NULL
        RETURNING *
      `, [body.title, body.slug, body.description, body.short_description, body.content, body.excerpt, body.client_name, body.project_url, body.service_id, body.category_id, body.meta_title, body.meta_description, body.is_featured, body.is_published, body.completed_at, body.sort_order, id, heroSectionId, body.featured_image_id])

      if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Project not found' }, { status: 404 }))
      revalidatePath('/projects')
      if (result.rows[0]?.slug) revalidatePath(`/projects/${result.rows[0].slug}`)
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/projects\/[^/]+$/) && method === 'DELETE') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const pool = getPool()
      await pool.query('UPDATE projects SET deleted_at = NOW() WHERE id = $1', [id])
      revalidatePath('/projects')
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // BLOG POSTS CRUD
    // ============================================
    if (route === '/blog' && method === 'GET') {
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
          WHERE bp.deleted_at IS NULL ${requireAdmin(request) ? '' : 'AND bp.is_published = true'}
          GROUP BY bp.id, c.name, u.email
          ORDER BY bp.published_at DESC, bp.created_at DESC
        `)
        return handleCORS(NextResponse.json(result.rows))
      } else {
        const site = await jsonGetSite()
        return handleCORS(NextResponse.json(site?.home?.blog?.items || []))
      }
    }

    if (route.match(/^\/blog\/[^/]+$/) && method === 'GET') {
      const slug = parts[1]
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
          WHERE bp.slug = $1 AND bp.deleted_at IS NULL
          GROUP BY bp.id, c.name, u.email
        `, [slug])
        if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Blog post not found' }, { status: 404 }))

        // Increment view count
        await pool.query('UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1', [result.rows[0].id])

        return handleCORS(NextResponse.json(result.rows[0]))
      }
      return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
    }

    if (route === '/blog' && method === 'POST') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      const pool = getPool()
      const id = uuidv4()

      const result = await pool.query(`
        INSERT INTO blog_posts (id, title, slug, excerpt, short_description, content, category_id, author_id, meta_title, meta_description, is_featured, is_published, published_at, reading_time_minutes, featured_image_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [id, body.title, body.slug, body.excerpt, body.short_description, body.content, body.category_id, session.userId, body.meta_title, body.meta_description, body.is_featured || false, body.is_published || false, body.is_published ? new Date() : null, body.reading_time_minutes || 5, body.featured_image_id || null])

      revalidatePath('/blog')
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/blog\/[^/]+$/) && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const id = parts[parts.length - 1]
      const body = await request.json()
      const pool = getPool()

      const result = await pool.query(`
        UPDATE blog_posts 
        SET title = $1, slug = $2, excerpt = $3, short_description = $4, content = $5, category_id = $6, meta_title = $7, meta_description = $8, 
            is_featured = $9, is_published = $10, published_at = $11, reading_time_minutes = $12, featured_image_id = $14
        WHERE id = $13 AND deleted_at IS NULL
        RETURNING *
      `, [body.title, body.slug, body.excerpt, body.short_description, body.content, body.category_id, body.meta_title, body.meta_description, body.is_featured, body.is_published, body.is_published && !body.published_at ? new Date() : body.published_at, body.reading_time_minutes, id, body.featured_image_id])

      if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Blog post not found' }, { status: 404 }))
      revalidatePath('/blog')
      if (result.rows[0]?.slug) revalidatePath(`/blog/${result.rows[0].slug}`)
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/blog\/[^/]+$/) && method === 'DELETE') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[parts.length - 1]
      const pool = getPool()
      await pool.query('UPDATE blog_posts SET deleted_at = NOW() WHERE id = $1', [id])
      revalidatePath('/blog')
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // CASE STUDIES CRUD
    // ============================================
    if (route === '/case-studies' && method === 'GET') {
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT cs.*,
                 (
                   SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                   FROM media_items fmi WHERE fmi.id = cs.featured_image_id
                 ) as featured_image
          FROM case_studies cs
          WHERE cs.deleted_at IS NULL ${requireAdmin(request) ? '' : 'AND cs.is_published = true'}
          ORDER BY cs.published_at DESC, cs.created_at DESC
        `)
        return handleCORS(NextResponse.json(result.rows))
      }
      return handleCORS(NextResponse.json([]))
    }

    if (route.match(/^\/case-studies\/[^/]+$/) && method === 'GET') {
      const slug = parts[1]
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
        if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Case study not found' }, { status: 404 }))

        // Increment view count
        await pool.query('UPDATE case_studies SET view_count = view_count + 1 WHERE id = $1', [result.rows[0].id])

        return handleCORS(NextResponse.json(result.rows[0]))
      }
      return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
    }

    if (route === '/case-studies' && method === 'POST') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      const pool = getPool()
      const id = uuidv4()

      const result = await pool.query(`
        INSERT INTO case_studies (id, title, slug, content, excerpt, short_description, client_name, industry, project_url, meta_title, meta_description, featured_image_id, is_featured, is_published, published_at, completed_at, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `, [id, body.title, body.slug, body.content, body.excerpt, body.short_description, body.client_name, body.industry, body.project_url, body.meta_title, body.meta_description, body.featured_image_id || null, body.is_featured || false, body.is_published !== false, body.published_at || new Date().toISOString(), body.completed_at, body.sort_order || 0])

      revalidatePath('/case-studies')
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/case-studies\/[^/]+$/) && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const id = parts[parts.length - 1]
      const body = await request.json()
      const pool = getPool()

      const result = await pool.query(`
        UPDATE case_studies 
        SET title = $1, slug = $2, content = $3, excerpt = $4, short_description = $5, client_name = $6, industry = $7, project_url = $8, meta_title = $9, meta_description = $10, featured_image_id = $11, is_featured = $12, is_published = $13, published_at = $14, completed_at = $15, sort_order = $16, updated_at = NOW()
        WHERE id = $17 AND deleted_at IS NULL
        RETURNING *
      `, [body.title, body.slug, body.content, body.excerpt, body.short_description, body.client_name, body.industry, body.project_url, body.meta_title, body.meta_description, body.featured_image_id || null, body.is_featured || false, body.is_published !== false, body.published_at, body.completed_at, body.sort_order || 0, id])

      if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Case study not found' }, { status: 404 }))
      revalidatePath('/case-studies')
      if (result.rows[0]?.slug) revalidatePath(`/case-studies/${result.rows[0].slug}`)
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/case-studies\/[^/]+$/) && method === 'DELETE') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const id = parts[parts.length - 1]
      const pool = getPool()
      await pool.query('UPDATE case_studies SET deleted_at = NOW() WHERE id = $1', [id])
      revalidatePath('/case-studies')
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // CMS PAGES CRUD
    // ============================================
    if (route === '/pages' && method === 'GET') {
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT p.*,
                 (
                   SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                   FROM media_items fmi WHERE fmi.id = p.featured_image_id
                 ) as featured_image
          FROM cms_pages p
          WHERE p.deleted_at IS NULL AND p.is_published = true
          ORDER BY p.sort_order ASC, p.created_at DESC
        `)
        return handleCORS(NextResponse.json(result.rows))
      }
      return handleCORS(NextResponse.json([]))
    }

    if (route.match(/^\/pages\/[^/]+$/) && method === 'GET') {
      const slug = parts[1]
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT p.*,
                 (
                   SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text)
                   FROM media_items fmi WHERE fmi.id = p.featured_image_id
                 ) as featured_image
          FROM cms_pages p WHERE p.slug = $1 AND p.deleted_at IS NULL
        `, [slug])
        if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Page not found' }, { status: 404 }))
        return handleCORS(NextResponse.json(result.rows[0]))
      }
      return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
    }

    if (route === '/pages' && method === 'POST') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      const pool = getPool()
      const id = uuidv4()

      const result = await pool.query(`
        INSERT INTO cms_pages (id, title, slug, content, template, meta_title, meta_description, is_published, show_in_menu, parent_id, sort_order, featured_image_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [id, body.title, body.slug, body.content, body.template || 'default', body.meta_title, body.meta_description, body.is_published !== false, body.show_in_menu || false, body.parent_id, body.sort_order || 0, body.featured_image_id || null])

      revalidatePath('/', 'layout')
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/pages\/[^/]+$/) && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const body = await request.json()
      const pool = getPool()

      const result = await pool.query(`
        UPDATE cms_pages 
        SET title = $1, slug = $2, content = $3, template = $4, meta_title = $5, meta_description = $6, 
            is_published = $7, show_in_menu = $8, parent_id = $9, sort_order = $10, featured_image_id = $12
        WHERE id = $11 AND deleted_at IS NULL
        RETURNING *
      `, [body.title, body.slug, body.content, body.template, body.meta_title, body.meta_description, body.is_published, body.show_in_menu, body.parent_id, body.sort_order, id, body.featured_image_id])

      if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Page not found' }, { status: 404 }))
      revalidatePath('/', 'layout')
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/pages\/[^/]+$/) && method === 'DELETE') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const pool = getPool()
      await pool.query('UPDATE cms_pages SET deleted_at = NOW() WHERE id = $1', [id])
      revalidatePath('/', 'layout') // Since pages can be anywhere
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // NAVIGATION CRUD
    // ============================================
    if (route === '/navigation' && method === 'GET') {
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT * FROM navigation_items
          WHERE is_active = true
          ORDER BY sort_order ASC, created_at ASC
        `)
        return handleCORS(NextResponse.json(result.rows))
      } else {
        const site = await jsonGetSite()
        return handleCORS(NextResponse.json(site?.navigation?.items || []))
      }
    }

    if (route === '/navigation' && method === 'POST') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      const pool = getPool()
      const id = uuidv4()

      const result = await pool.query(`
        INSERT INTO navigation_items (id, label, url, parent_id, icon, target, is_active, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [id, body.label, body.url, body.parent_id, body.icon, body.target || '_self', body.is_active !== false, body.sort_order || 0])

      revalidatePath('/', 'layout')
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/navigation\/[^/]+$/) && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const body = await request.json()
      const pool = getPool()

      const result = await pool.query(`
        UPDATE navigation_items 
        SET label = $1, url = $2, parent_id = $3, icon = $4, target = $5, is_active = $6, sort_order = $7
        WHERE id = $8
        RETURNING *
      `, [body.label, body.url, body.parent_id, body.icon, body.target, body.is_active, body.sort_order, id])

      if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Navigation item not found' }, { status: 404 }))
      revalidatePath('/', 'layout')
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/navigation\/[^/]+$/) && method === 'DELETE') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const pool = getPool()
      await pool.query('DELETE FROM navigation_items WHERE id = $1', [id])
      revalidatePath('/', 'layout')
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // HERO SECTIONS CRUD
    // ============================================
    if (route === '/hero' && method === 'GET') {
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT h.*, 
                 json_agg(DISTINCT jsonb_build_object('id', hm.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', hm.variant)) FILTER (WHERE hm.id IS NOT NULL) as media,
                 json_agg(DISTINCT jsonb_build_object('id', hb.id, 'text', hb.text, 'icon', hb.icon, 'sort_order', hb.sort_order)) FILTER (WHERE hb.id IS NOT NULL) as bullets
          FROM hero_sections h
          LEFT JOIN hero_media hm ON h.id = hm.hero_id
          LEFT JOIN media_items mi ON hm.media_id = mi.id
          LEFT JOIN hero_bullets hb ON h.id = hb.hero_id
          WHERE h.is_active = true
          GROUP BY h.id
          ORDER BY h.created_at DESC
        `)
        return handleCORS(NextResponse.json(result.rows))
      }
      return handleCORS(NextResponse.json([]))
    }

    if (route.match(/^\/hero\/[^/]+$/) && method === 'GET') {
      const pageKey = parts[1]
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT h.*, 
                 json_agg(DISTINCT jsonb_build_object('id', hm.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', hm.variant)) FILTER (WHERE hm.id IS NOT NULL) as media,
                 json_agg(DISTINCT jsonb_build_object('id', hb.id, 'text', hb.text, 'icon', hb.icon, 'sort_order', hb.sort_order)) FILTER (WHERE hb.id IS NOT NULL) as bullets
          FROM hero_sections h
          LEFT JOIN hero_media hm ON h.id = hm.hero_id
          LEFT JOIN media_items mi ON hm.media_id = mi.id
          LEFT JOIN hero_bullets hb ON h.id = hb.hero_id
          WHERE h.page_key = $1
          GROUP BY h.id
        `, [pageKey])
        if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Hero section not found' }, { status: 404 }))
        return handleCORS(NextResponse.json(result.rows[0]))
      }
      return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
    }

    if (route === '/hero' && method === 'POST') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      const pool = getPool()
      const id = uuidv4()

      const result = await pool.query(`
        INSERT INTO hero_sections (id, page_key, title, subtitle, kicker, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, background_type, background_video_url, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [id, body.page_key, body.title, body.subtitle, body.kicker, body.primary_cta_label, body.primary_cta_url, body.secondary_cta_label, body.secondary_cta_url, body.background_type || 'image', body.background_video_url, body.is_active !== false])

      // Save media items
      if (body.media && Array.isArray(body.media)) {
        for (const media of body.media) {
          // Insert into media_items first
          const mediaId = uuidv4()
          const filename = media.url.split('/').pop()
          await pool.query(`
            INSERT INTO media_items (id, url, filename, alt_text, mime_type, size_bytes)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [mediaId, media.url, filename, media.alt || '', 'image/jpeg', 0])

          // Then link to hero_sections via hero_media
          await pool.query(`
            INSERT INTO hero_media (id, hero_id, media_id, variant)
            VALUES ($1, $2, $3, $4)
          `, [uuidv4(), id, mediaId, media.variant || 'desktop'])
        }
      }

      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/hero\/[^/]+$/) && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const body = await request.json()
      const pool = getPool()

      const result = await pool.query(`
        UPDATE hero_sections 
        SET page_key = $1, title = $2, subtitle = $3, kicker = $4, primary_cta_label = $5, primary_cta_url = $6, 
            secondary_cta_label = $7, secondary_cta_url = $8, background_type = $9, background_video_url = $10, is_active = $11
        WHERE id = $12
        RETURNING *
      `, [body.page_key, body.title, body.subtitle, body.kicker, body.primary_cta_label, body.primary_cta_url, body.secondary_cta_label, body.secondary_cta_url, body.background_type, body.background_video_url, body.is_active, id])

      if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Hero section not found' }, { status: 404 }))

      // Update media items - delete old ones and insert new ones
      if (body.media && Array.isArray(body.media)) {
        // Delete existing hero_media relationships
        await pool.query('DELETE FROM hero_media WHERE hero_id = $1', [id])

        // Insert new media items
        for (const media of body.media) {
          // Insert into media_items first
          const mediaId = uuidv4()
          const filename = media.url.split('/').pop()
          await pool.query(`
            INSERT INTO media_items (id, url, filename, alt_text, mime_type, size_bytes)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [mediaId, media.url, filename, media.alt || '', 'image/jpeg', 0])

          // Then link to hero_sections via hero_media
          await pool.query(`
            INSERT INTO hero_media (id, hero_id, media_id, variant)
            VALUES ($1, $2, $3, $4)
          `, [uuidv4(), id, mediaId, media.variant || 'desktop'])
        }
      }

      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/hero\/[^/]+$/) && method === 'DELETE') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const pool = getPool()
      await pool.query('DELETE FROM hero_sections WHERE id = $1', [id])
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // SITE SETTINGS CRUD
    // ============================================
    if (route === '/settings' && method === 'GET') {
      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query('SELECT * FROM site_settings ORDER BY key')
        const settings = {}
        result.rows.forEach(row => {
          settings[row.key] = row.value
        })
        return handleCORS(NextResponse.json(settings))
      }
      return handleCORS(NextResponse.json({}))
    }

    if (route === '/settings' && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const body = await request.json()
      const pool = getPool()

      // Update or insert each setting
      for (const [key, value] of Object.entries(body)) {
        await pool.query(`
          INSERT INTO site_settings (id, key, value, updated_at)
          VALUES ($1, $2, $3::jsonb, NOW())
          ON CONFLICT (key) DO UPDATE SET value = $3::jsonb, updated_at = NOW()
        `, [uuidv4(), key, JSON.stringify(value)])
      }

      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ============================================
    // MEDIA LIBRARY
    // ============================================
    if (route === '/media' && method === 'GET') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      if (await pgEnabled()) {
        const pool = getPool()
        const result = await pool.query(`
          SELECT m.*, u.email as uploaded_by_email
          FROM media_items m
          LEFT JOIN df_users u ON m.uploaded_by = u.id
          ORDER BY m.created_at DESC
          LIMIT 100
        `)
        return handleCORS(NextResponse.json(result.rows))
      }
      return handleCORS(NextResponse.json([]))
    }

    if (route.match(/^\/media\/[^/]+$/) && method === 'PUT') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const body = await request.json()
      const pool = getPool()

      const result = await pool.query(`
        UPDATE media_items 
        SET alt_text = $1, caption = $2
        WHERE id = $3
        RETURNING *
      `, [body.alt_text, body.caption, id])

      if (!result.rows[0]) return handleCORS(NextResponse.json({ error: 'Media not found' }, { status: 404 }))
      return handleCORS(NextResponse.json(result.rows[0]))
    }

    if (route.match(/^\/media\/[^/]+$/) && method === 'DELETE') {
      const session = requireAdmin(request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      const id = parts[1]
      const pool = getPool()
      await pool.query('DELETE FROM media_items WHERE id = $1', [id])
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // Legacy endpoints for backward compatibility
    if (route === '/footer' && method === 'GET') {
      const site = (await pgEnabled()) ? await pgGetSite() : await jsonGetSite()
      return handleCORS(NextResponse.json(site?.footer || {}))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

async function upsertHero(pool, hero, pageKey, existingHeroId) {
  if (!hero) return null

  let heroId = existingHeroId || uuidv4()
  const isActive = hero.is_active !== false
  const bgType = hero.background_type || 'image'

  // Try update or insert via ON CONFLICT
  // If we have existingHeroId, we prioritize that. But page_key must handle conflict.
  // Actually, simplest is to use ON CONFLICT(page_key) always.
  // But if we want to change page_key (slug changed), we might fail constraint if we don't update key.
  // The 'page_key' arg is the NEW key.

  if (existingHeroId) {
    // Update existing record
    await pool.query(`
        UPDATE hero_sections 
        SET page_key = $1, title = $2, subtitle = $3, kicker = $4, 
            primary_cta_label = $5, primary_cta_url = $6, 
            secondary_cta_label = $7, secondary_cta_url = $8, 
            background_type = $9, background_video_url = $10, is_active = $11, updated_at = NOW()
        WHERE id = $12
      `, [pageKey, hero.title, hero.subtitle, hero.kicker, hero.primary_cta_label, hero.primary_cta_url, hero.secondary_cta_label, hero.secondary_cta_url, bgType, hero.background_video_url, isActive, heroId])
  } else {
    // Insert new or updated via page_key conflict
    const res = await pool.query(`
        INSERT INTO hero_sections (id, page_key, title, subtitle, kicker, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, background_type, background_video_url, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (page_key) DO UPDATE 
        SET title = $3, subtitle = $4, kicker = $5, 
            primary_cta_label = $6, primary_cta_url = $7, 
            secondary_cta_label = $8, secondary_cta_url = $9, 
            background_type = $10, background_video_url = $11, is_active = $12, updated_at = NOW()
        RETURNING id
      `, [heroId, pageKey, hero.title, hero.subtitle, hero.kicker, hero.primary_cta_label, hero.primary_cta_url, hero.secondary_cta_label, hero.secondary_cta_url, bgType, hero.background_video_url, isActive])
    heroId = res.rows[0].id
  }

  // Handle Media
  if (hero.media && Array.isArray(hero.media)) {
    await pool.query('DELETE FROM hero_media WHERE hero_id = $1', [heroId])

    for (const m of hero.media) {
      if (!m.url) continue
      const mediaId = uuidv4()
      const filename = m.url.split('/').pop() || 'unknown'

      await pool.query(`
            INSERT INTO media_items (id, url, filename, alt_text, mime_type, size_bytes)
            VALUES ($1, $2, $3, $4, $5, $6)
         `, [mediaId, m.url, filename, m.alt || '', 'image/jpeg', 0])

      await pool.query(`
            INSERT INTO hero_media (id, hero_id, media_id, variant)
            VALUES ($1, $2, $3, $4)
         `, [uuidv4(), heroId, mediaId, m.variant || 'desktop'])
    }
  }

  // Revalidate homepage or relevant page
  revalidatePath('/')
  revalidatePath(`/${pageKey}`)
  return heroId
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
