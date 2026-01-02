'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function MainServicesProjects({ services = [], projects = [] }) {
    // Ensure we have exactly or at most 6 services for the grid
    const displayServices = services.slice(0, 6)
    // Ensure we have exactly or at most 2 projects for the showcase
    const displayProjects = projects.slice(0, 2)

    return (
        <section className="relative w-full bg-black text-white pt-[160px] pb-[160px] md:pt-[90px] md:pb-[90px] overflow-hidden">
            {/* Optional Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] bg-[url('/images/pattern-dot.svg')] pointer-events-none" />

            <div className="container relative z-10 max-w-[1280px] mx-auto px-4 md:px-10">

                {/* INTRO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-[46px] font-bold mb-6 font-heading">Our Services</h2>
                    <p className="text-gray-400 text-[15px] leading-[26px] mx-auto md:max-w-[60%]">
                        We offer a comprehensive range of services to help you achieve your digital goals. From custom software development to stunning design, we have you covered.
                    </p>
                </motion.div>

                {/* SERVICES GRID (3 Columns, 2 Rows) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-32">
                    {displayServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.3, delay: 0.3 + (index * 0.1) }}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Service Image */}
                            <div className="w-full aspect-[100/83] overflow-hidden rounded-[5px] mb-10 relative">
                                <Link href={`/services/${service.slug}`}>
                                    <img
                                        src={service.featured_image?.url || service.icon_url || '/images/placeholder-service.jpg'}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </Link>
                            </div>

                            {/* Service Content */}
                            <h5 className="text-xl font-bold mb-4 font-heading group-hover:text-[#ffffff] transition-colors">
                                <Link href={`/services/${service.slug}`}>{service.title}</Link>
                            </h5>
                            <p className="text-gray-400 text-[15px] leading-[26px]">
                                {service.short_description || service.excerpt || "Professional service description goes here."}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* PROJECTS GRID (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-[40px] gap-y-[80px]">
                    {displayProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group w-full aspect-[4/3] md:aspect-[3/2] rounded-[5px] overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]"
                        >
                            {/* Background Image */}
                            <img
                                src={project.featured_image?.url || '/images/placeholder-project.jpg'}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-[36px] md:p-[60px] flex flex-col justify-end items-start text-left z-10">
                                {/* Category Label */}
                                <span className="text-[#ffffff] text-sm font-bold uppercase tracking-wider mb-2">
                                    {project.category?.name || "Development"}
                                </span>

                                {/* Title */}
                                <h2 className="text-3xl md:text-[46px] font-bold text-white mb-6 font-heading leading-tight">
                                    {project.title}
                                </h2>

                                {/* Separator */}
                                <div className="w-full h-px bg-white/20 mb-8" />

                                {/* Button */}
                                <Link
                                    href={`/projects/${project.slug}`}
                                    className="inline-flex items-center text-white font-bold text-sm tracking-wide group/btn"
                                >
                                    <span className="uppercase mr-2">View Project</span>
                                    <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
