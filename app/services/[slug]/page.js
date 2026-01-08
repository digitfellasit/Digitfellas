
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { renderMarkdown } from '@/lib/render-markdown'
import { getPool } from '@/lib/db'
import { notFound } from 'next/navigation'
import { HeroSection } from '@/components/HeroSection'

export const dynamic = 'force-dynamic'

async function getServiceBySlug(slug) {
    if (!process.env.DATABASE_URL) return null
    const pool = getPool()

    try {
        const res = await pool.query(`
        SELECT s.*, c.name as category_name,
               (SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text) FROM media_items fmi WHERE fmi.id = s.featured_image_id) as featured_image,
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
        WHERE s.slug = $1 AND s.deleted_at IS NULL
    `, [slug])

        return res.rows[0] || null
    } catch (e) {
        console.error("Failed to fetch service data", e)
        return null
    }
}

export async function generateMetadata({ params }) {
    const service = await getServiceBySlug(params.slug)
    if (!service) return { title: 'Service Not Found' }

    return {
        title: service.meta_title || service.title,
        description: service.meta_description || service.short_description,
        openGraph: {
            title: service.meta_title || service.title,
            description: service.meta_description || service.short_description,
            images: service.featured_image?.url ? [{ url: service.featured_image.url, alt: service.featured_image.alt || service.title }] : []
        }
    }
}

export default async function ServiceDetailPage({ params }) {
    const service = await getServiceBySlug(params.slug)

    if (!service) {
        notFound()
    }

    const features = service.features ? JSON.parse(JSON.stringify(service.features)) : []
    // Handle if features is a string (legacy)
    const featuresList = typeof features === 'string' ? JSON.parse(features) : (Array.isArray(features) ? features : [])

    return (
        <div className="min-h-screen bg-[#01010e]">
            {/* Use Service Specific Hero if available, else standard header spacer */}
            {service.hero && <HeroSection hero={service.hero} />}

            <div className="container py-24 md:py-28">
                {!service.hero && (
                    <div className="mb-16">
                        <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Capabilities
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">{service.title}</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                            {service.short_description}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {service.featured_image?.url && !service.hero && (
                            <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 border border-white/10">
                                <Image
                                    src={service.featured_image.url}
                                    alt={service.featured_image.alt || service.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        <div className="prose prose-lg prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(service.content) }} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {featuresList.length > 0 && (
                            <Card className="p-8 bg-[#02000f]/50 border-white/10 rounded-2xl">
                                <h3 className="text-xl font-bold mb-6">Key Features</h3>
                                <ul className="space-y-4">
                                    {featuresList.map((feature, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-foreground/90">
                                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                            <span>{typeof feature === 'string' ? feature : feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        )}

                        <Card className="p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4">Ready to build?</h3>
                            <p className="text-muted-foreground mb-6 text-sm">
                                Let's discuss how our {service.title} services can help you scale.
                            </p>
                            <Button asChild className="w-full rounded-full font-bold">
                                <Link href="/contact">
                                    Reference This Service <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
