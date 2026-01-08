
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Code2, Globe, Smartphone, Cpu, Layout, Cloud, Database, Shield, BarChart3, Zap, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeroSection } from '@/components/HeroSection'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { getPool } from '@/lib/db'

// Force dynamic since we query DB directly
export const dynamic = 'force-dynamic'

async function getServicesData() {
    if (!process.env.DATABASE_URL) return { hero: null, services: [] }
    const pool = getPool()

    try {
        const [heroRes, servicesRes] = await Promise.all([
            // Fetch Hero
            pool.query(`
        SELECT h.*, 
            json_agg(DISTINCT jsonb_build_object('id', hm.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', hm.variant)) FILTER (WHERE hm.id IS NOT NULL) as media
        FROM hero_sections h
        LEFT JOIN hero_media hm ON h.id = hm.hero_id
        LEFT JOIN media_items mi ON hm.media_id = mi.id
        WHERE h.page_key = $1
        GROUP BY h.id
      `, ['capabilities']),

            // Fetch Services
            pool.query(`
        SELECT s.id, s.title, s.slug, s.short_description, s.description, s.icon_url, s.sort_order,
            (SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text) FROM media_items fmi WHERE fmi.id = s.featured_image_id) as featured_image
        FROM services s
        WHERE s.deleted_at IS NULL AND s.is_published = true
        ORDER BY s.sort_order ASC, s.created_at DESC
      `)
        ])

        return {
            hero: heroRes.rows[0] || null,
            services: servicesRes.rows || []
        }
    } catch (e) {
        console.error("Failed to fetch services page data", e)
        return { hero: null, services: [] }
    }
}

const getServiceIcon = (title = '') => {
    const t = title.toLowerCase()
    if (t.includes('web')) return Globe
    if (t.includes('app') || t.includes('mobile')) return Smartphone
    if (t.includes('ai') || t.includes('learning') || t.includes('automation')) return Cpu
    if (t.includes('design') || t.includes('ux') || t.includes('interface')) return Layout
    if (t.includes('cloud') || t.includes('devops') || t.includes('infrastructure')) return Cloud
    if (t.includes('data') || t.includes('analytics') || t.includes('insight')) return Database
    if (t.includes('security') || t.includes('privacy') || t.includes('assurance')) return Shield
    if (t.includes('strategy') || t.includes('consult') || t.includes('digital')) return BarChart3
    if (t.includes('product') || t.includes('engineer')) return Zap
    if (t.includes('enterprise') || t.includes('platform')) return Layers
    return Code2 // Default
}

export default async function ServicesPage() {
    const { hero, services } = await getServicesData()

    return (
        <div className="min-h-screen bg-[#01010e] text-white">
            {hero && <HeroSection hero={hero} />}

            <section className="container py-24 md:py-28">
                {/* Extra padding if no hero */}
                {!hero && <div className="h-12 md:h-16" />}

                {!hero && (
                    <ScrollReveal variant="fade-up">
                        <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tight mb-6 text-white">
                            Our Capabilities
                        </h1>
                        <p className="text-xl text-slate-300 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
                            End-to-end digital product engineering services driven by quality and performance.
                        </p>
                    </ScrollReveal>
                )}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, i) => {
                        const Icon = getServiceIcon(service.title)
                        return (
                            <ScrollReveal
                                key={service.id}
                                variant="fade-up"
                                delay={i * 100}
                                className="group"
                            >
                                <Link href={`/capabilities/${service.slug}`} className="h-full block">
                                    <Card className="h-full p-8 bg-[#0c053e]/40 border-white/10 hover:border-primary/50 transition-all hover:bg-[#331676]/20 flex flex-col backdrop-blur-sm shadow-xl">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="w-7 h-7 text-primary" />
                                        </div>

                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors text-white">
                                            {service.title}
                                        </h3>

                                        <p className="text-slate-300 leading-relaxed flex-grow mb-8 line-clamp-4 text-sm">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-2 transition-transform">
                                            Explore Capability <ArrowRight className="ml-2 w-4 h-4" />
                                        </div>
                                    </Card>
                                </Link>
                            </ScrollReveal>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
