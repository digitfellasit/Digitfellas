'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProjects, useHero } from '@/lib/api-hooks'
import { HeroSection } from '@/components/HeroSection'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function ProjectsListingPage() {
  const { projects, loading } = useProjects()
  const { hero } = useHero('projects')

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      {hero && <HeroSection hero={hero} />}

      <section className="container py-16 md:py-24">
        {!hero && (
          <ScrollReveal
            variant="fade-up"
          >
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Portfolio</div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Our Work
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12">
              Selected case studies and builds across web, automation, and product engineering.
            </p>
          </ScrollReveal>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ScrollReveal
              key={project.id}
              variant="fade-up"
              delay={i * 100}
              className="group"
            >
              <Link href={`/projects/${project.slug}`}>
                <Card className="overflow-hidden rounded-3xl border-white/10 shadow-2xl hover:shadow-primary/10 transition-shadow">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      alt={project.title}
                      src={project.featured_image?.url || project.images?.[0]?.url || '/uploads/placeholder-project.jpg'}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-6 left-6 right-6">
                      {project.category_name && (
                        <Badge className="mb-3 rounded-full bg-primary border-none px-4">
                          {project.category_name}
                        </Badge>
                      )}
                      <h3 className="text-2xl font-extrabold text-white">{project.title}</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          tag && tag.name && (
                            <Badge key={tag.id} variant="secondary" className="text-xs">
                              {tag.name}
                            </Badge>
                          )
                        ))}
                      </div>
                    )}
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                      {project.excerpt || project.description}
                    </p>
                    <Button variant="outline" className="w-full rounded-full py-6 font-bold hover:bg-primary hover:text-primary-foreground transition-all border-2">
                      Explore Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {projects.length === 0 && (
          <Card className="p-12 text-center rounded-3xl">
            <p className="text-muted-foreground">No projects available yet. Check back soon!</p>
          </Card>
        )}
      </section>
    </div>
  )
}
