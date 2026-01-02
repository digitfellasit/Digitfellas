'use client'

import { motion } from 'framer-motion'
import { useClientLogos } from '@/lib/homepage-hooks'

export function SponsorsSection() {
    const { data: logos = [], isLoading } = useClientLogos()

    if (isLoading) return null // Or a loading skeleton
    if (!logos.length) return null

    // Max row width 1248px
    // Padding Top 95px | Bottom 0px
    // Columns: 5 (20% each) on Desktop, 2 (50%) on generic Mobile

    return (
        <section className="relative w-full overflow-hidden bg-transparent pt-[95px] pb-0">
            {/* Background Pattern/Mask (Optional - using generic dot/mask if available or just transparent) */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/images/pattern-dot.svg')] bg-repeat z-0" />

            <div className="container relative z-10 max-w-[1248px] mx-auto px-4">
                <div className="flex flex-wrap justify-center md:justify-between items-center -mx-4 md:mx-0">
                    {logos.map((logo, index) => (
                        <motion.div
                            key={logo.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 1.3,
                                delay: index * 0.1, // Staggered delay 0-0.4s+
                                ease: "easeOut"
                            }}
                            className="w-1/2 md:w-1/5 px-4 mb-[30px] md:mb-0 flex justify-center items-center"
                        >
                            <div className="relative group w-full flex justify-center">
                                <img
                                    src={logo.logo_url}
                                    alt={logo.name}
                                    className="max-w-[171px] max-h-[52px] w-auto h-auto object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
