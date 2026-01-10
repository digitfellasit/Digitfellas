import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { renderMarkdown } from '@/lib/render-markdown'
import { getPool } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CapabilityHero } from '@/components/sections/CapabilityHero'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

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

        // Normalize Hero Data or Construct Default from Service Data
        let normalizedHero = null
        const h = (typeof service.hero_data === 'string' ? JSON.parse(service.hero_data) : service.hero_data) || {}

        normalizedHero = {
            title: h.title || service.title,
            // User requested Long Description on the left side
            subtitle: h.tagline || service.description || service.short_description,
            // Background Image from Hero configuration (Admin -> Capabilities -> Hero & Header -> Desktop Background)
            backgroundImage: h.desktop?.[0]?.url || '/images/Hero_Background.webp',
            mobileBackgroundImage: h.mobile?.[0]?.url || '/images/Hero_Background.webp',
            // Featured Image (Card Image) for the right side card
            featuredImage: service.featured_image?.url || null,

            // Pass explicitly as heading/subheading for compatibility if needed
            heading: h.title || service.title,
            subheading: h.tagline || service.description || service.short_description
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
    const safeParse = (val, fallback = []) => {
        if (!val) return fallback
        if (typeof val === 'object') return val
        try {
            const parsed = JSON.parse(val)
            return parsed || fallback
        } catch (e) {
            return fallback
        }
    }

    const features = safeParse(service.features)
    const featuresList = Array.isArray(features) ? features : []

    const detailsSections = safeParse(service.details_sections)
    const sectionsList = Array.isArray(detailsSections) ? detailsSections : []

    const faq = safeParse(service.faq)
    const faqList = Array.isArray(faq) ? faq : []

    const isCentered = service.template === 'centered'

    return (
        <div className="min-h-screen bg-[#01010e] text-white">
            {/* 1. Hero Section (Unified Logic) */}
            <CapabilityHero hero={service.hero} />

            <div className="container max-w-[1240px] mx-auto pt-20 pb-12 px-6">

                {/* 2. Intro Content (Large Typography) */}
                {/* 2. Intro Content (Large Typography) */}
                {(service.intro_content || service.intro_title) && (
                    <ScrollReveal className={`mb-32 ${isCentered ? 'text-center mx-auto max-w-4xl' : 'max-w-4xl'}`}>
                        {service.intro_title && (
                            <h2 className="text-3xl md:text-2xl font-bold text-foreground leading-tight mb-6 tracking-tight font-heading">
                                {service.intro_title}
                            </h2>
                        )}
                        {service.intro_content && (
                            <div
                                className="prose prose-2xl prose-invert max-w-none prose-p:text-slate-200 prose-p:leading-relaxed font-light whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(service.intro_content) }}
                            />
                        )}
                    </ScrollReveal>
                )}

                {/* 3. Features Grid (The "Grid Box") */}
                {featuresList.length > 0 && (
                    <div className="mb-36">
                        <ScrollReveal>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-px flex-grow bg-white/10" />
                                <h2 className="text-3xl md:text-2xl font-bold text-foreground leading-tight mb-6 tracking-tight whitespace-nowrap uppercase tracking-widest">
                                    {service.features_title || 'Core Capabilities'}
                                </h2>

                                <div className="h-px flex-grow bg-white/10" />
                            </div>
                            {service.features_description && (
                                <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12">
                                    {service.features_description}
                                </p>
                            )}
                        </ScrollReveal>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuresList.map((feature, i) => (
                                <ScrollReveal
                                    key={i}
                                    delay={i * 100}
                                    className="h-full group p-8 rounded-3xl bg-[#0c053e] border border-white/10 hover:border-[#331676]/30 hover:bg-[#331676] transition-all duration-500 relative overflow-hidden text-left shadow-sm"
                                >
                                    {/* Subtle Gradient Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/5 transition-all duration-500" />

                                    <div className="relative z-10">
                                        <h4 className="text-xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                                            {feature.title || (typeof feature === 'string' ? feature : `Feature ${i + 1}`)}
                                        </h4>
                                        <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-200 transition-colors line-clamp-4">
                                            {feature.description || feature.text || ''}
                                        </p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-0">
                    <div className="lg:col-span-8 space-y-32">
                        {service.content && (
                            <ScrollReveal className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300">
                                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(service.content) }} />
                            </ScrollReveal>
                        )}

                        {sectionsList.map((section, idx) => {
                            const hasImage = !!section.image?.[0]?.url
                            return (
                                <ScrollReveal
                                    key={section.id || idx}
                                    className={`flex flex-col gap-16 py-8 border-t border-white/5 ${section.swapLayout && hasImage ? 'md:flex-row-reverse' : 'md:flex-row'} ${!hasImage ? 'justify-center' : 'items-center'}`}
                                >
                                    <div className={`flex flex-col justify-center ${hasImage ? 'w-full md:w-1/2' : 'w-full max-w-4xl mx-auto text-center'}`}>

                                        {/* Header */}
                                        {section.header && (
                                            <h3 className={`text-3xl md:text-2xl font-bold text-foreground leading-tight mb-6 ${!hasImage ? 'text-center' : 'text-left'}`}>
                                                {section.header}
                                            </h3>
                                        )}

                                        {/* Content */}
                                        <div
                                            className={`prose prose-lg prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-li:text-slate-300 leading-relaxed font-light ${!hasImage ? 'text-center' : 'text-left'}`}
                                            dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content || '') }}
                                        />
                                    </div>

                                    {hasImage && (
                                        <div className="w-full md:w-1/2 relative">
                                            <div className="relative overflow-hidden rounded-[1rem] lg:rounded-[2rem] shadow-2xl bg-[#0c053e] border border-white/10 w-full h-full aspect-[4/3] lg:aspect-[4/3]">
                                                <Image
                                                    src={section.image[0].url}
                                                    alt={section.image[0].alt || 'Section Image'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </ScrollReveal>
                            )
                        })}

                        {/* FAQ Section */}
                        {faqList.length > 0 && (
                            <ScrollReveal className="py-16 border-t border-white/5">
                                <h3 className="text-3xl md:text-2xl font-bold text-foreground leading-tight mb-6">Frequently Asked Questions</h3>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {faqList.map((item, i) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border-white/10 px-6 rounded-2xl bg-white/5 data-[state=open]:bg-white/10 transition-colors">
                                            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6 text-slate-300 leading-relaxed text-base">
                                                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(item.answer) }} />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </ScrollReveal>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            <Card className="p-10 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border-primary/40 rounded-[3rem] shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-3xl font-bold mb-4 text-white tracking-tight">
                                        {service.cta_title || 'Ready to build?'}
                                    </h3>
                                    <p className="text-slate-200 text-lg leading-relaxed font-light whitespace-pre-wrap">
                                        {service.cta_description || `Accelerate your ${service.title} roadmap with our expert engineering teams.`}
                                    </p>
                                    <Button asChild className="w-full rounded-full font-bold bg-white text-black hover:bg-slate-200 transition-all py-8 text-xl shadow-lg hover:shadow-primary/30 active:scale-95">
                                        <Link href={service.cta_link || '/contact'} className="flex items-center justify-center">
                                            {service.cta_button_text || 'Work With Us'} <ArrowRight className="ml-3 w-6 h-6" />
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
