'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProject } from '@/lib/api-hooks'
import { renderMarkdown } from '@/lib/render-markdown'
import { HeroSection } from '@/components/HeroSection'

export default function ProjectDetailPage() {
    const params = useParams()
    const slug = params?.slug
    const { project, loading, error } = useProject(slug)

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container py-24">
                    <div className="h-12 w-64 rounded-full bg-muted animate-pulse mb-8" />
                    <div className="mt-6 h-20 w-3/4 rounded-3xl bg-muted animate-pulse mb-4" />
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="max-w-md w-full rounded-3xl border-border p-8 text-center shadow-2xl">
                    <h2 className="text-2xl font-bold mb-3">Project Not Found</h2>
                    <p className="text-muted-foreground mb-8">
                        {error || 'The project you\'re looking for doesn\'t exist.'}
                    </p>
                    <Button asChild className="w-full rounded-full py-6">
                        <Link href="/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
                        </Link>
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {project.hero && <HeroSection hero={project.hero} />}
            <div className="container py-16 md:py-24">
                <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Projects
                </Link>

                <div className="max-w-5xl">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        {project.category_name && (
                            <Badge className="rounded-full px-4 py-1">
                                {project.category_name}
                            </Badge>
                        )}
                        {project.tags && project.tags.length > 0 && project.tags.map((tag) => (
                            tag && tag.name && (
                                <Badge key={tag.id} variant="outline" className="rounded-full px-3 py-1">
                                    {tag.name}
                                </Badge>
                            )
                        ))}
                    </div>
                </div>

                {!project.hero && <h1 className="text-4xl md:text-6xl font-bold mb-6">{project.title}</h1>}

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                    {project.client_name && (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {project.client_name}
                        </div>
                    )}
                    {project.completed_at && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(project.completed_at).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {project.excerpt && (
                    <p className="text-xl text-muted-foreground mb-12">{project.excerpt}</p>
                )}

                {project.images && project.images.length > 0 && (
                    <div className="mb-12">
                        <img
                            src={project.images[0].url}
                            alt={project.images[0].alt || project.title}
                            className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                        />
                    </div>
                )}

                {project.content && (
                    <Card className="p-8 md:p-12 mb-12">
                        <h2 className="text-2xl font-bold mb-6">About This Project</h2>
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(project.content) }}
                        />
                    </Card>
                )}

                {project.project_url && (
                    <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-primary/5">
                        <h2 className="text-2xl font-bold mb-4">View Live Project</h2>
                        <p className="text-muted-foreground mb-6">
                            Check out the live version of this project.
                        </p>
                        <Button asChild size="lg" className="rounded-full">
                            <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                Visit Project
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </Card>
                )}
            </div>
        </div>

    )
}
