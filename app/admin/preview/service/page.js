'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { renderMarkdown } from '@/lib/render-markdown'
import { HeroSection } from '@/components/HeroSection'

export default function ServicePreviewPage() {
    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const data = localStorage.getItem('df_preview_service')
        if (data) {
            try {
                setService(JSON.parse(data))
            } catch (e) {
                console.error('Failed to parse preview data', e)
            }
        }
        setLoading(false)
    }, [])

    const { normalizedHero, featuresList, detailsSections, faqList, isCentered, ctaData } = useMemo(() => {
        if (!service) return { normalizedHero: null, featuresList: [], detailsSections: [], faqList: [], isCentered: false, ctaData: {} }

        // Normalize Hero
        let h = service.hero_data || {}
        // If string, parse
        if (typeof h === 'string') {
            try { h = JSON.parse(h) } catch (e) { h = {} }
        }

        let normHero = null
        if (h.desktop?.length > 0 || h.mobile?.length > 0 || h.title) {
            const media = []
            if (h.desktop?.[0]?.url) media.push({ ...h.desktop[0], variant: 'desktop' })
            if (h.mobile?.[0]?.url) media.push({ ...h.mobile[0], variant: 'mobile' })

            normHero = {
                title: h.title || service.title,
                subtitle: h.tagline || service.short_description,
                media: media
            }
        }

        // Features
        let f = service.features || []
        if (typeof f === 'string') { try { f = JSON.parse(f) } catch (e) { f = [] } }
        const fList = Array.isArray(f) ? f : []

        // Details
        let d = service.details_sections || []
        if (typeof d === 'string') { try { d = JSON.parse(d) } catch (e) { d = [] } }
        const dList = Array.isArray(d) ? d : []

        // FAQ
        let q = service.faq || []
        if (typeof q === 'string') { try { q = JSON.parse(q) } catch (e) { q = [] } }
        const qList = Array.isArray(q) ? q : []

        return {
            normalizedHero: normHero,
            featuresList: fList,
            detailsSections: dList,
            faqList: qList,
            isCentered: service.template === 'centered',
            ctaData: {
                title: service.cta_title,
                description: service.cta_description,
                buttonText: service.cta_button_text,
                link: service.cta_link
            }
        }
    }, [service])


    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
                <Card className="max-w-md w-full p-8 text-center bg-gray-900 border-gray-800">
                    <h2 className="text-2xl font-bold mb-3 text-white">No Preview Data Found</h2>
                    <p className="text-gray-400 mb-6">Please return to the admin panel and click Preview again.</p>
                    <Button variant="outline" onClick={() => window.close()}>Close Preview</Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#01010e] text-white">
            {/* 0. PREVIEW BANNER */}
            <div className="fixed top-0 left-0 right-0 z-[20055] bg-yellow-500/90 text-black text-center py-2 font-bold backdrop-blur-sm">
                PREVIEW MODE - Content not saved
            </div>

            {/* 1. Hero Section */}
            {normalizedHero ? (
                <HeroSection hero={normalizedHero} />
            ) : (
                <div className="bg-[#0c053e] pt-32 pb-20">
                    <div className="container max-w-[1240px] mx-auto px-6">
                        <div className="inline-flex items-center text-sm text-slate-400 mb-8">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Capabilities
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">{service.title}</h1>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
                            {service.short_description}
                        </p>
                    </div>
                </div>
            )}

            <div className="container max-w-[1240px] mx-auto py-20 px-6">

                {/* 2. Intro Content */}
                {service.intro_content && (
                    <div className={`mb-24 ${isCentered ? 'text-center mx-auto max-w-4xl' : 'max-w-4xl'}`}>
                        <div
                            className="prose prose-2xl prose-invert max-w-none prose-p:text-slate-200 prose-p:leading-relaxed font-light whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(service.intro_content) }}
                        />
                    </div>
                )}

                {/* 3. Features Grid */}
                {featuresList.length > 0 && (
                    <div className="mb-32">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px flex-grow bg-white/10" />
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight whitespace-nowrap uppercase tracking-widest text-primary/80">
                                {service.features_title || 'Core Capabilities'}
                            </h2>
                            <div className="h-px flex-grow bg-white/10" />
                        </div>
                        {service.features_description && (
                            <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12">
                                {service.features_description}
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuresList.map((feature, i) => {
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
                                            <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors whitespace-pre-wrap">
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

                        {detailsSections.map((section, idx) => {
                            const hasImage = !!section.image?.[0]?.url
                            return (
                                <div
                                    key={section.id || idx}
                                    className={`flex flex-col gap-12 py-16 border-t border-white/5 ${section.swapLayout && hasImage ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
                                >
                                    <div className={`space-y-6 ${hasImage ? 'flex-1' : 'w-full'}`}>
                                        <div
                                            className={`prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-h2:text-4xl prose-h2:mb-8 font-heading whitespace-pre-wrap ${isCentered && !hasImage ? 'text-center mx-auto' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content || '') }}
                                        />
                                    </div>
                                    {hasImage && (
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
                            )
                        })}

                        {/* FAQ Section */}
                        {faqList.length > 0 && (
                            <div className="py-16 border-t border-white/5">
                                <h3 className="text-3xl font-bold mb-12 text-white">Frequently Asked Questions</h3>
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
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            <Card className="p-10 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border-primary/40 rounded-[3rem] shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-3xl font-bold mb-4 text-white tracking-tight">
                                        {ctaData.title || 'Ready to build?'}
                                    </h3>
                                    <p className="text-slate-200 text-lg leading-relaxed font-light whitespace-pre-wrap">
                                        {ctaData.description || `Accelerate your ${service.title} roadmap with our expert engineering teams.`}
                                    </p>
                                    <Button asChild className="w-full rounded-full font-bold bg-white text-black hover:bg-slate-200 transition-all py-8 text-xl shadow-lg hover:shadow-primary/30 active:scale-95">
                                        <div className="flex items-center justify-center">
                                            {ctaData.buttonText || 'Work With Us'} <ArrowRight className="ml-3 w-6 h-6" />
                                        </div>
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                                            Available for new projects
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
