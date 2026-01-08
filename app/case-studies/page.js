'use client'

import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCaseStudies, useHero } from '@/lib/api-hooks'
import { HeroSection } from '@/components/HeroSection'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function CaseStudiesListingPage() {
    const { caseStudies, loading } = useCaseStudies()
    const { hero } = useHero('case-studies')

    if (loading) {
        return (
            <div className="min-h-screen bg-[#01010e]">
                <Head>
                    <title>Case Studies - Digitfellas</title>
                    <meta name="description" content="Selected case studies and builds across web, automation, and product engineering." />
                </Head>
                <div className="container py-24">
                    <div className="h-12 w-48 rounded-full bg-muted animate-pulse mb-4" />
                    <div className="h-8 w-64 rounded-full bg-muted animate-pulse mb-12" />
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#01010e]">
            <Head>
                <title>Case Studies - Our Work | Digitfellas</title>
                <meta name="description" content="Selected case studies and builds across web, automation, and product engineering from Digitfellas." />
                <meta property="og:title" content="Case Studies - Our Work | Digitfellas" />
                <meta property="og:description" content="Selected case studies and builds across web, automation, and product engineering from Digitfellas." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Case Studies - Our Work | Digitfellas" />
                <meta name="twitter:description" content="Selected case studies and builds across web, automation, and product engineering from Digitfellas." />
            </Head>
            {hero && <HeroSection hero={hero} />}

            <section className="container py-24 md:py-28">
                {!hero && (
                    <ScrollReveal
                        variant="fade-up"
                    >

                        <h1 className="text-2xl md:text-4xl font-bold text-center tracking-tight mb-6">
                            Case Studies
                        </h1>
                        <p className="text-xl text-muted-foreground text-center mb-12">
                            Selected case studies and builds across web, automation, and product engineering.
                        </p>
                    </ScrollReveal>
                )}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {caseStudies.map((caseStudy, i) => (
                        <ScrollReveal
                            key={caseStudy.id}
                            variant="fade-up"
                            delay={i * 100}
                            className="group"
                        >
                            <Link href={`/case-studies/${caseStudy.slug}`}>
                                <Card className="h-full overflow-hidden bg-[#02000f] rounded-3xl border-white/10 shadow-2xl hover:shadow-primary/10 transition-shadow">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            alt={caseStudy.featured_image?.alt || caseStudy.title}
                                            src={caseStudy.featured_image?.url || '/uploads/placeholder-project.jpg'}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            {caseStudy.industry && (
                                                <Badge className="mb-3 rounded-full bg-primary border-none px-4">
                                                    {caseStudy.industry}
                                                </Badge>
                                            )}
                                            <h3 className="text-2xl font-extrabold text-white">{caseStudy.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        {caseStudy.client_name && (
                                            <div className="text-sm text-muted-foreground mb-4">
                                                Client: <span className="text-foreground font-medium">{caseStudy.client_name}</span>
                                            </div>
                                        )}
                                        <p className="text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                                            {caseStudy.short_description || caseStudy.excerpt}
                                        </p>
                                        <Button variant="outline" className="w-full rounded-full py-6 font-bold bg-[#100d1c] hover:bg-primary hover:text-primary-foreground transition-all border-2">
                                            View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                {caseStudies.length === 0 && (
                    <Card className="p-12 text-center rounded-3xl">
                        <p className="text-muted-foreground">No case studies available yet. Check back soon!</p>
                    </Card>
                )}
            </section>
        </div>
    )
}
