'use client'

import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBlog, useHero } from '@/lib/api-hooks'
import { HeroSection } from '@/components/HeroSection'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function InsightsListingPage() {
  const { posts, loading } = useBlog()
  const { hero } = useHero('insights')

  if (loading) {
    return (
      <div className="min-h-screen bg-[#01010e]">
        <Head>
          <title>Insights - Digitfellas</title>
          <meta name="description" content="Practical engineering notes, product thinking, and delivery lessons." />
        </Head>
        <div className="container py-24">
          <div className="h-12 w-48 rounded-full bg-muted animate-pulse mb-4" />
          <div className="h-8 w-64 rounded-full bg-muted animate-pulse mb-12" />
          <div className="grid gap-6 md:grid-cols-3">
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
        <title>Insights - Articles & Updates | Digitfellas</title>
        <meta name="description" content="Practical engineering notes, product thinking, and delivery lessons from Digitfellas." />
        <meta property="og:title" content="Insights - Articles & Updates | Digitfellas" />
        <meta property="og:description" content="Practical engineering notes, product thinking, and delivery lessons from Digitfellas." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Insights - Articles & Updates | Digitfellas" />
        <meta name="twitter:description" content="Practical engineering notes, product thinking, and delivery lessons from Digitfellas." />
      </Head>
      {hero && <HeroSection hero={hero} />}

      <section className="container py-16 md:py-24">
        {!hero && (
          <ScrollReveal
            variant="fade-up"
          >
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Insights</div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Articles & Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12">
              Practical engineering notes, product thinking, and delivery lessons.
            </p>
          </ScrollReveal>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <ScrollReveal
              key={post.id}
              variant="fade-up"
              delay={i * 100}
            >
              <Link href={`/insights/${post.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden rounded-3xl border-border hover:shadow-2xl transition-shadow">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      alt={post.title}
                      src={post.featured_image?.url || post.featured_image_url || '/uploads/placeholder-blog.jpg'}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Draft'}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          tag && tag.name && (
                            <Badge key={tag.id} variant="secondary" className="text-xs">
                              {tag.name}
                            </Badge>
                          )
                        ))}
                      </div>
                    )}

                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                    <Button variant="outline" className="w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {posts.length === 0 && (
          <Card className="p-12 text-center rounded-3xl">
            <p className="text-muted-foreground">No insights available. Check back soon!</p>
          </Card>
        )}
      </section>
    </div>
  )
}
