'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useServices, useHero } from '@/lib/api-hooks'
import { HeroSection } from '@/components/HeroSection'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function ServicesListingPage() {
  const { services, loading } = useServices()
  const { hero } = useHero('services')

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-24">
          <div className="h-12 w-48 rounded-full bg-muted animate-pulse mb-4" />
          <div className="h-8 w-64 rounded-full bg-muted animate-pulse mb-12" />
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {hero && <HeroSection hero={hero} />}

      <section className="container py-16 md:py-24">
        {!hero && (
          <ScrollReveal
            variant="fade-up"
          >
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Services</div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              What We Do
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12">
              End-to-end delivery from idea to deployment — optimized for speed and reliability.
            </p>
          </ScrollReveal>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ScrollReveal
              key={service.id}
              variant="fade-up"
              delay={i * 100}
              className="group h-full"
            >
              <Card className="h-full relative overflow-hidden rounded-3xl border-white/10 p-8 shadow-sm transition-all group-hover:shadow-2xl group-hover:shadow-primary/5">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />

                <div className="relative h-full flex flex-col">
                  {(service.featured_image?.url || (service.images && service.images.length > 0)) ? (
                    <div className="mb-6 w-full h-48 rounded-2xl overflow-hidden relative">
                      <Image
                        src={service.featured_image?.url || service.images?.[0]?.url}
                        alt={service.featured_image?.alt || service.images?.[0]?.alt || service.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  )}

                  {service.category_name && (
                    <Badge variant="secondary" className="mb-3 w-fit rounded-full px-3 py-1 text-xs">
                      {service.category_name}
                    </Badge>
                  )}

                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                    {service.excerpt || service.description}
                  </p>

                  <Button asChild variant="outline" className="w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link href={`/services/${service.slug}`}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {services.length === 0 && (
          <Card className="p-12 text-center rounded-3xl">
            <p className="text-muted-foreground">No services available yet. Check back soon!</p>
          </Card>
        )}
      </section>
    </div>
  )
}
