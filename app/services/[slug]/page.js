'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useService } from '@/lib/api-hooks'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { renderMarkdown } from '@/lib/render-markdown'

function FeatureCard({ feature }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const description = feature.description || ''
  const shouldTruncate = description.length > 120

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
      {feature.image?.[0]?.url && (
        <div className="mb-6 h-48 overflow-hidden rounded-xl bg-gray-100 w-full shrink-0 relative">
          <Image
            src={feature.image[0].url}
            alt={feature.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">{feature.title}</h3>
      <p className="text-gray-600 leading-relaxed flex-grow">
        {isExpanded ? description : (shouldTruncate ? description.slice(0, 120) + '...' : description)}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary font-semibold mt-4 text-sm hover:underline self-start focus:outline-none"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  )
}

export default function ServiceDetailPage() {
  const params = useParams()
  const slug = params?.slug || ''
  const { service, loading, error } = useService(slug)

  // Memoize derived data to prevent recalculation on every render
  const { hero, features, detailsSections } = useMemo(() => {
    if (!service) return { hero: {}, features: [], detailsSections: [] }

    const h = service.hero_data || {}
    const f = Array.isArray(service.features) ? service.features : []

    // Handle Legacy + Array Details
    let d = service.details_sections || []
    if (d.length === 0 && service.details_section?.content) {
      d = [service.details_section]
    }

    return { hero: h, features: f, detailsSections: d }
  }, [service])

  const desktopBg = hero.desktop?.[0]?.url || '/images/hero-bg.svg'
  const mobileBg = hero.mobile?.[0]?.url || desktopBg

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center bg-card">
          <h2 className="text-2xl font-bold mb-3">Service Not Found</h2>
          <Button asChild className="w-full">
            <Link href="/services">Back to Services</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[60vh] md:min-h-[700px] flex items-center overflow-hidden bg-[#0F0F0F] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={desktopBg}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 md:px-12 py-20">
          <div className="max-w-3xl">
            {hero.tagline && (
              <ScrollReveal variant="fadeUp" className="mb-6">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary text-sm font-bold uppercase tracking-wider">
                  {hero.tagline}
                </span>
              </ScrollReveal>
            )}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                {hero.title || service.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <div className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
                {service.short_description}
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.3}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg">
                <Link href="/contact">Get Started</Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. INTRO CONTENT */}
      {service.intro_content && (
        <section className="py-20 md:py-32 bg-white">
          <ScrollReveal className="container px-6 md:px-12 mx-auto max-w-5xl text-center">
            <div
              className="prose prose-lg md:prose-xl max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(service.intro_content) }}
            />
          </ScrollReveal>
        </section>
      )}

      {/* 3. FEATURES GRID */}
      {features.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container px-6 md:px-12 mx-auto">
            <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {features.map((feature, idx) => (
                <ScrollReveal key={feature.id || idx} variant="fadeUp" className="h-full">
                  <FeatureCard feature={feature} />
                </ScrollReveal>
              ))}
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 4. DETAILS / SWAP SECTIONS */}
      {detailsSections.map((details, idx) => {
        const hasImage = details.image?.[0]?.url
        const swap = details.swapLayout
        const size = details.imageSize || 'medium'
        const isFull = size === 'full'

        // Classes logic
        const imgWidth = size === 'small' ? 'lg:w-[30%]' : size === 'large' ? 'lg:w-[70%]' : 'lg:w-1/2'
        const contentWidth = size === 'small' ? 'lg:w-[70%]' : size === 'large' ? 'lg:w-[30%]' : 'lg:w-1/2'

        return (
          <section key={idx} className={`py-24 overflow-hidden ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="container px-6 md:px-12 mx-auto">
              <div className={`flex flex-col ${isFull ? 'gap-10' : 'lg:flex-row'} items-center gap-16 ${swap ? 'lg:flex-row-reverse' : ''}`}>

                <div className={`w-full ${hasImage && !isFull ? contentWidth : 'w-full'}`}>
                  <ScrollReveal variant="fadeUp">
                    <div
                      className="prose prose-lg text-gray-600 max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(details.content) }}
                    />
                  </ScrollReveal>
                </div>

                {hasImage && (
                  <div className={`w-full ${isFull ? 'w-full' : imgWidth}`}>
                    <ScrollReveal variant={swap ? "fadeUp" : "fadeUp"} delay={0.2}>
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video">
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10"></div>
                        <Image
                          src={details.image[0].url}
                          alt="Service Details"
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </ScrollReveal>
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA */}
      <section className="py-24 bg-[#0F0F0F] text-white text-center">
        <ScrollReveal className="container px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to transform your business?</h2>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-16 text-xl">
            <Link href="/contact">
              Let's Work Together <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </ScrollReveal>
      </section>
    </div>
  )
}
