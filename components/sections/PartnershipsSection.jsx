'use client'

import React from 'react'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useClientLogos } from '@/lib/homepage-hooks'

export function PartnershipsSection({ data, logos: initialLogos = [] }) {
    const { data: clientLogos = [] } = useClientLogos()

    const {
        title = "Platforms & Partnerships",
        description = "We work with leading technologies to deliver scalable solutions."
    } = data || {}

    // Prioritize server-passed logos for SSR, fallback to client-side data
    const displayLogos = clientLogos.length > 0 ? clientLogos : initialLogos
    const marqueeItems = displayLogos.map(logo => ({ ...logo, type: 'image' }))

    // Duplicate for seamless loop - triple/quadruple to ensure container is filled on large screens
    const duplicatedItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems]

    return (
        <section className="relative w-full bg-[#01010e] py-24 border-t border-border overflow-hidden transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row items-center justify-center mb-16">
                    {/* Header & Content */}
                    <div className="max-w-xl text-center">
                        <ScrollReveal variant="fade-up">
                            <h3 className="text-2xl font-bold text-foreground leading-tight font-heading mb-6">
                                {title}
                            </h3>
                            <p className="text-muted-foreground text-base font-body leading-relaxed max-w-lg mx-auto">
                                {description}
                            </p>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden">
                    {/* Fade overlays on edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#01010e] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#01010e] to-transparent z-10 pointer-events-none" />

                    <div className="flex animate-marquee items-center whitespace-nowrap">
                        {duplicatedItems.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="flex-shrink-0 mx-10 md:mx-16"
                            >
                                <div className="relative opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 flex items-center justify-center h-[40px] md:h-[50px] w-auto">
                                    <Image
                                        src={item.logo_url}
                                        alt={item.name}
                                        width={140}
                                        height={60}
                                        className="h-full w-auto object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 40s linear infinite;
                }

                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}
