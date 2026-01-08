import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, User, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { renderMarkdown } from '@/lib/render-markdown'
import { getCaseStudyBySlug } from '@/lib/case-studies-service'
import { notFound } from 'next/navigation'

// Force dynamic rendering to avoid build-time database connection issues
export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function generateMetadata({ params }) {
    const slug = params?.slug
    const caseStudy = await getCaseStudyBySlug(slug)

    if (!caseStudy) {
        return {
            title: 'Case Study Not Found',
            description: 'The requested case study could not be found.'
        }
    }

    return {
        title: caseStudy.meta_title || caseStudy.title,
        description: caseStudy.meta_description || caseStudy.excerpt || caseStudy.short_description,
        openGraph: {
            title: caseStudy.meta_title || caseStudy.title,
            description: caseStudy.meta_description || caseStudy.excerpt,
            type: 'article',
            images: caseStudy.featured_image?.url ? [{ url: caseStudy.featured_image.url, alt: caseStudy.featured_image.alt || caseStudy.title }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: caseStudy.meta_title || caseStudy.title,
            description: caseStudy.meta_description || caseStudy.excerpt,
            images: caseStudy.featured_image?.url ? [caseStudy.featured_image.url] : undefined,
        }
    }
}

export default async function CaseStudyPage({ params }) {
    const slug = params?.slug
    const caseStudy = await getCaseStudyBySlug(slug)

    if (!caseStudy) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-[#01010e]">
            <div className="container py-24 md:py-28">
                <Link href="/case-studies" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Case Studies
                </Link>

                <div className="max-w-4xl mx-auto">
                    {/* Industry Badge */}
                    {caseStudy.industry && (
                        <Badge className="mb-4 rounded-full px-4 py-1">
                            {caseStudy.industry}
                        </Badge>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{caseStudy.title}</h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                        {caseStudy.client_name && (
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {caseStudy.client_name}
                            </div>
                        )}
                        {caseStudy.completed_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(caseStudy.completed_at).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    {/* Excerpt */}
                    {caseStudy.excerpt && (
                        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                            {caseStudy.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    {caseStudy.content && (
                        <div
                            className="prose prose-lg prose-invert max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(caseStudy.content) }}
                        />
                    )}

                    {/* Project URL */}
                    {caseStudy.project_url && (
                        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                            <h2 className="text-2xl font-bold mb-4">View Live Project</h2>
                            <p className="text-muted-foreground mb-6">
                                Check out the live version of this project.
                            </p>
                            <Button asChild size="lg" className="rounded-full">
                                <a href={caseStudy.project_url} target="_blank" rel="noopener noreferrer">
                                    Visit Project
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
