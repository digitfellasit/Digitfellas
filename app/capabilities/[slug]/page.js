import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
               (SELECT json_build_object('id', fmi.id, 'url', fmi.url, 'alt', fmi.alt_text) FROM media_items fmi WHERE fmi.id = s.featured_image_id) as featured_image
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE s.slug = $1 AND s.deleted_at IS NULL
    `, [slug])

        const service = res.rows[0] || null
        if (!service) return null

        // Fetch other capabilities for the sidebar
        const othersRes = await pool.query(`
            SELECT title, slug FROM services 
            WHERE slug != $1 AND deleted_at IS NULL AND is_published = true
            ORDER BY sort_order ASC, title ASC 
            LIMIT 5
        `, [slug])
        service.related = othersRes.rows || []

        // Normalize Hero Data from the JSONB column
        let normalizedHero = null
        if (service.hero_data) {
            const h = typeof service.hero_data === 'string' ? JSON.parse(service.hero_data) : service.hero_data
            if (h.desktop?.length > 0 || h.mobile?.length > 0 || h.title) {
                const media = []
                if (h.desktop?.[0]?.url) media.push({ ...h.desktop[0], variant: 'desktop' })
                if (h.mobile?.[0]?.url) media.push({ ...h.mobile[0], variant: 'mobile' })

                normalizedHero = {
                    title: h.title || service.title,
                    subtitle: h.tagline || service.short_description,
                    media: media
                }
            }
        }

        service.hero = normalizedHero
        return service
    } catch (e) {
        console.error("Failed to fetch service data", e)
        return null
    }
}

export async function generateMetadata({ params }) {
    const service = await getServiceBySlug(params.slug)
    if (!service) return { title: 'Capability Not Found' }

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

    // Parse JSON fields safely
    const features = service.features ? (typeof service.features === 'string' ? JSON.parse(service.features) : service.features) : []
    const featuresList = Array.isArray(features) ? features : []

    const detailsSections = service.details_sections ? (typeof service.details_sections === 'string' ? JSON.parse(service.details_sections) : service.details_sections) : []
    const sectionsList = Array.isArray(detailsSections) ? detailsSections : []

    return (
        <div className="min-h-screen bg-[#01010e] text-white">
            {/* 1. Hero Section */}
            {service.hero ? (
                <HeroSection hero={service.hero} />
            ) : (
                <div className="bg-[#0c053e] pt-32 pb-20">
                    <div className="container px-6">
                        <Link href="/capabilities" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Capabilities
                        </Link>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">{service.title}</h1>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
                            {service.short_description}
                        </p>
                    </div>
                </div>
            )}

            <div className="container py-20 px-6">

                {/* 2. Intro Content (Large Typography) */}
                {service.intro_content && (
                    <div className="max-w-4xl mb-24">
                        <div
                            className="prose prose-2xl prose-invert max-w-none prose-p:text-slate-200 prose-p:leading-relaxed font-light"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(service.intro_content) }}
                        />
                    </div>
                )}

                {/* 3. Features Grid (The "Grid Box") */}
                {featuresList.length > 0 && (
                    <div className="mb-32">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-grow bg-white/10" />
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight whitespace-nowrap uppercase tracking-widest text-primary/80">Core Capabilities</h2>
                            <div className="h-px flex-grow bg-white/10" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuresList.map((feature, i) => {
                                // Robust Image Handling
                                let imgArr = [];
                                const rawImg = feature.image;
                                if (Array.isArray(rawImg)) imgArr = rawImg;
                                else if (typeof rawImg === 'string') {
                                    try { imgArr = JSON.parse(rawImg); } catch (e) { imgArr = []; }
                                } else if (rawImg && typeof rawImg === 'object') {
                                    imgArr = [rawImg];
                                }

                                const hImage = imgArr?.[0]?.url;

                                return (
                                    <Card key={i} className="flex flex-col bg-[#0c053e]/40 border-white/10 hover:border-primary/50 transition-all duration-500 group backdrop-blur-sm rounded-[2rem] overflow-hidden">
                                        {hImage && (
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <Image
                                                    src={hImage}
                                                    alt={feature.title || 'Feature Image'}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0c053e] to-transparent opacity-60" />
                                            </div>
                                        )}
                                        <div className="p-8 space-y-4 flex-grow">
                                            <div className="flex items-center gap-3">
                                                {!hImage && (
                                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                        <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-white" />
                                                    </div>
                                                )}
                                                <h4 className={`text-xl font-bold text-white group-hover:text-primary transition-colors ${hImage ? 'w-full' : ''}`}>
                                                    {feature.title || (typeof feature === 'string' ? feature : `Feature ${i + 1}`)}
                                                </h4>
                                            </div>
                                            <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
                                                {feature.description || feature.text || ''}
                                            </p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    <div className="lg:col-span-8 space-y-32">
                        {service.content && (
                            <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300">
                                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(service.content) }} />
                            </div>
                        )}

                        {sectionsList.map((section, idx) => (
                            <div
                                key={section.id || idx}
                                className={`flex flex-col gap-12 py-16 border-t border-white/5 ${section.swapLayout ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
                            >
                                <div className="flex-1 space-y-6">
                                    <div
                                        className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-h2:text-4xl prose-h2:mb-8 font-heading"
                                        dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content || '') }}
                                    />
                                </div>
                                {section.image?.[0]?.url && (
                                    <div className={`flex-1 w-full relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group`}>
                                        <Image
                                            src={section.image[0].url}
                                            alt={section.image[0].alt || 'Section Image'}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            <Card className="p-10 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border-primary/40 rounded-[3rem] shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-3xl font-bold mb-4 text-white tracking-tight">Ready to build?</h3>
                                    <p className="text-slate-200 text-lg leading-relaxed font-light">
                                        Accelerate your {service.title} roadmap with our expert engineering teams.
                                    </p>
                                    <Button asChild className="w-full rounded-full font-bold bg-white text-black hover:bg-slate-200 transition-all py-8 text-xl shadow-lg hover:shadow-primary/30 active:scale-95">
                                        <Link href="/contact" className="flex items-center justify-center">
                                            Work With Us <ArrowRight className="ml-3 w-6 h-6" />
                                        </Link>
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                                            Available for new projects
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <div className="p-8 border border-white/10 rounded-[2rem] bg-white/[0.03] backdrop-blur-md">
                                <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-8">More Capabilities</h4>
                                <div className="space-y-6">
                                    {service.related?.map((related) => (
                                        <Link
                                            key={related.slug}
                                            href={`/capabilities/${related.slug}`}
                                            className="block text-slate-300 hover:text-white transition-colors text-lg font-medium group"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                                                {related.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
