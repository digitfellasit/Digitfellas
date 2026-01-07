import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { renderMarkdown } from '@/lib/render-markdown'
import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/blog-service'
import { notFound } from 'next/navigation'

// ISR: Revalidate every hour
export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export default async function BlogPostPage({ params }) {
  const slug = params?.slug
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#01010e]">
      <article className="container py-16 md:py-24">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{post.title}</h1>

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

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Featured Image */}
          {post.featured_image?.url && (
            <div className="mb-12 relative h-[500px]">
              <Image
                src={post.featured_image.url}
                alt={post.title}
                fill
                className="object-cover rounded-3xl shadow-2xl"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
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
              Check out more of our articles or get in touch to discuss your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  More Articles
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
