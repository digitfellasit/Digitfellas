'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useService } from '@/lib/api-hooks'
import { renderMarkdown } from '@/lib/render-markdown'
import { HeroSection } from '@/components/HeroSection'

export default function ServiceDetailPage() {
  const params = useParams()
  const slug = params?.slug
  const { service, loading, error } = useService(slug)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-24">
          <div className="h-12 w-64 rounded-full bg-muted animate-pulse mb-8" />
          <div className="mt-6 h-20 w-3/4 rounded-3xl bg-muted animate-pulse mb-4" />
          <div className="mt-3 h-6 w-2/3 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full rounded-3xl border-border p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold mb-3">Service Not Found</h2>
          <p className="text-muted-foreground mb-8">
            {error || 'The service you\'re looking for doesn\'t exist.'}
          </p>
          <Button asChild className="w-full rounded-full py-6">
            <Link href="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {service.hero && <HeroSection hero={service.hero} />}
      <div className="container py-16 md:py-24">
        <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Link>

        <div className="max-w-4xl">
          {service.category_name && (
            <Badge className="mb-4 rounded-full px-4 py-1">
              {service.category_name}
            </Badge>
          )}

          {!service.hero && <h1 className="text-4xl md:text-6xl font-bold mb-6">{service.title}</h1>}

          {service.excerpt && (
            <p className="text-xl text-muted-foreground mb-12">{service.excerpt}</p>
          )}

          {service.images && service.images.length > 0 && (
            <div className="mb-12">
              <img
                src={service.images[0].url}
                alt={service.images[0].alt || service.title}
                className="w-full h-[400px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          )}

          {service.content && (
            <Card className="p-8 md:p-12 mb-12">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(service.content) }}
              />
            </Card>
          )}

          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-primary/5">
            <h2 className="text-2xl font-bold mb-4">Interested in this service?</h2>
            <p className="text-muted-foreground mb-6">
              Let's discuss how we can help you with {service.title.toLowerCase()}.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">
                Contact Us
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div >
  )
}
