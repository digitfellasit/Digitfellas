'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function FeaturedProjects({ projects }) {
    if (!projects || projects.length === 0) return null

    return (
        <section className="py-32 bg-[#0A0A0A] relative" id="projects">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#3B82F6] font-semibold tracking-wider uppercase text-sm mb-4 block">Our Portfolio</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                            Discover Our <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-purple-500">Selected Projects</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:text-right"
                    >
                        <Button variant="outline" className="rounded-full px-8 h-12 border-white/10 text-white hover:bg-white/5 hover:text-white" asChild>
                            <Link href="/projects">
                                View All Projects <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {projects.slice(0, 4).map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group ${index % 2 !== 0 ? 'md:translate-y-16' : ''}`} // Staggered grid layout
                        >
                            <Link href={`/projects/${project.slug}`}>
                                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#121212] border border-white/5 mb-8 shadow-2xl transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                                    <img
                                        src={project.featured_image?.url || project.images?.[0]?.url || '/uploads/placeholder-hero.jpg'}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                                    />

                                    {/* Hover Overlay Button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                                            <ArrowRight className="w-8 h-8 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                                            {project.category_name || 'Design & Dev'}
                                        </span>
                                        <div className="h-px bg-white/10 flex-1" />
                                        <span className="text-xs text-gray-500 font-mono">2024</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white group-hover:text-[#3B82F6] transition-colors mb-2 font-heading">{project.title}</h3>
                                    <p className="text-gray-400 line-clamp-2">
                                        {project.short_description || project.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
