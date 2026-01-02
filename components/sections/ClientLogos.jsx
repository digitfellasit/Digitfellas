'use client'

import { motion } from 'framer-motion'
import { useClientLogos } from '@/lib/homepage-hooks'
import { useEffect, useRef } from 'react'

export function ClientLogosSection() {
    const { data: logos = [], isLoading } = useClientLogos()
    const scrollRef = useRef(null)

    // Duplicate logos for infinite scroll
    const duplicatedLogos = [...logos, ...logos, ...logos]

    if (isLoading || logos.length === 0) return null

    return (
        <section className="py-12 bg-muted/30 overflow-hidden">
            <div className="container mb-6">
                <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Trusted by Leading Companies
                </p>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

                <motion.div
                    ref={scrollRef}
                    className="flex gap-12 items-center"
                    animate={{
                        x: [0, -100 * logos.length / 3]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={`${logo.id}-${index}`}
                            className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                        >
                            <img
                                src={logo.logo_url}
                                alt={logo.name}
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
