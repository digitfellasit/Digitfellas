'use client'

import { m } from 'framer-motion'
import { useClientLogos } from '@/lib/homepage-hooks'
import { useRef } from 'react'
import Image from 'next/image'

export function ClientLogosSection() {
    const { data: logos = [], isLoading } = useClientLogos()
    const scrollRef = useRef(null)

    // Duplicate logos for infinite scroll
    const duplicatedLogos = [...logos, ...logos, ...logos]

    if (isLoading || logos.length === 0) return null

    return (
        <section className="py-8 md:py-12 bg-muted/30 overflow-hidden">
            <div className="container mb-4 md:mb-6 px-4 md:px-6">
                <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Trusted by Leading Companies
                </p>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

                <m.div
                    ref={scrollRef}
                    className="flex gap-12 items-center"
                    animate={{
                        x: [0, -100 * logos.length / 3]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 25,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={`${logo.id}-${index}`}
                            className="flex-shrink-0 transition-all duration-300 relative h-12 w-40"
                        >
                            <Image
                                src={logo.logo_url}
                                alt={logo.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100px, 150px"
                            />
                        </div>
                    ))}
                </m.div>
            </div>
        </section>
    )
}
