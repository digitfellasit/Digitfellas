'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export function ServicesGrid({ services }) {
    if (!services || services.length === 0) return null

    return (
        <section className="py-32 bg-[#0A0A0A] relative overflow-hidden" id="services">
            {/* Decorative Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            <div className="container relative z-10">
                {/* Header removed as it is now in ProfessionalServices section */}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.slice(0, 3).map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative cursor-pointer"
                        >
                            <Link href={`/services/${service.slug}`} className="block h-full">
                                <div className="relative h-[500px] w-full overflow-hidden rounded-[2rem] border border-white/5 bg-[#121212] transition-all duration-500 hover:border-[#3B82F6]/50 group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)]">

                                    {/* Background Image Area (Top Half) */}
                                    <div className="absolute inset-x-0 top-0 h-[60%] overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/50 to-[#121212] z-10" />
                                        <img
                                            src={service.featured_image?.url || service.images?.[0]?.url || '/uploads/placeholder-hero.jpg'}
                                            alt={service.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                                        />
                                    </div>

                                    {/* Content Area (Bottom) */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                                        <div className="transform transition-all duration-300 group-hover:-translate-y-2">
                                            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-[#3B82F6] backdrop-blur-md group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-3 leading-tight font-heading group-hover:text-[#3B82F6] transition-colors">
                                                {service.title}
                                            </h3>

                                            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100">
                                                {service.short_description || service.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
