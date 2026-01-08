import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { renderMarkdown } from '@/lib/render-markdown'
import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/blog-service'
import { notFound } from 'next/navigation'

// Force dynamic rendering to avoid build-time database connection issues
export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function generateMetadata({ params }) {
  const slug = params?.slug
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Insight Not Found',
      description: 'The requested insight could not be found.'
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || post.short_description,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: post.author_name ? [post.author_name] : undefined,
      images: post.featured_image?.url ? [{ url: post.featured_image.url, alt: post.featured_image.alt || post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image?.url ? [post.featured_image.url] : undefined,
    }
  }
}

export default async function InsightPage({ params }) {
  const slug = params?.slug
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#01010e]">
      <article className="container py-16 md:py-24">
        <Link href="/insights" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Insights
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                tag && tag.name && (
                  <Badge key={tag.id} variant="secondary" className="rounded-full px-3 py-1">
                    {tag.name}
                  </Badge>
                )
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-6">{post.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            {post.author_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author_name}
              </div>
            )}
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
            {post.reading_time_minutes && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.reading_time_minutes} min read
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.featured_image?.url && (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl">
              <Image
                src={post.featured_image.url}
                alt={post.featured_image.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          {post.content && (
            <div
              className="prose prose-lg max-w-none mb-12 prose-invert"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />
          )}

          {/* CTA */}
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-primary/5 mt-16 border-white/5">
            <h2 className="text-2xl font-bold mb-4">Enjoyed this article?</h2>
            <p className="text-muted-foreground mb-6">
              Check out more of our insights or get in touch to discuss your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/insights">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  More Insights
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </Card>
        </div>
      </article>
    </div>
  )
}
