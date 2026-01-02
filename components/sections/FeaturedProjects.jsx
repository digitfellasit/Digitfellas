'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function FeaturedProjects({ projects }) {
    if (!projects || projects.length === 0) return null

    return (
        <section className="py-32 bg-[#0A0A0A] relative" id="projects">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
                    <ScrollReveal
                        variant="fade-up"
                    >
                        <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Our Portfolio</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                            Discover Our <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-purple-500">Selected Projects</span>
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal
                        variant="fade-up"
                        delay={100}
                        className="lg:text-right"
                    >
                        <Button variant="outline" className="rounded-full px-8 h-12 border-white/10 text-white hover:bg-white/5 hover:text-white" asChild>
                            <Link href="/projects">
                                View All Projects <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </ScrollReveal>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {projects.slice(0, 4).map((project, index) => (
                        <ScrollReveal
                            key={project.id}
                            variant="fade-up"
                            delay={index * 150}
                            className={`group relative cursor-pointer ${index % 2 !== 0 ? 'md:translate-y-16' : ''}`}
                        >
                            <Link href={`/projects/${project.slug}`}>
                                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#121212] border border-white/5 mb-8 shadow-2xl transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                                    <Image
                                        src={project.featured_image?.url || project.images?.[0]?.url || '/uploads/placeholder-hero.jpg'}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                                            <ArrowRight className="w-8 h-8 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                            {project.category_name || 'Design & Dev'}
                                        </span>
                                        <div className="h-px bg-white/10 flex-1" />
                                        <span className="text-xs text-gray-500 font-mono">2024</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors mb-2 font-heading">{project.title}</h3>
                                    <p className="text-gray-400 line-clamp-2">
                                        {project.short_description || project.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
