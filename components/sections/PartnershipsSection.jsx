'use client'

import React from 'react'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useClientLogos } from '@/lib/homepage-hooks'

export function PartnershipsSection({ data }) {
    const { data: clientLogos = [] } = useClientLogos()

    const {
        title = "Platforms & Partnerships",
        description = "We work with leading technologies to deliver scalable solutions."
    } = data || {}

    // Static Partners Data
    const partners = [
        { name: 'Shopify', label: 'Partner', type: 'text' },
        { name: 'Salesforce', label: 'Partner', type: 'text' },
        { name: 'AWS', label: 'Cloud', type: 'text' }
    ]

    // Combine for Marquee
    // We want a mix of text-based partner logos and image-based client logos
    const marqueeItems = [
        ...partners,
        ...clientLogos.map(logo => ({ ...logo, type: 'image' }))
    ]

    // Duplicate for seamless loop if we have items
    const duplicatedItems = marqueeItems.length > 0 ? [...marqueeItems, ...marqueeItems, ...marqueeItems] : [...partners, ...partners, ...partners, ...partners]

    return (
        <section className="relative w-full bg-[#01010e] py-24 border-t border-border overflow-hidden transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row items-center justify-center mb-16">
                    {/* Header & Content */}
                    <div className="max-w-xl text-center">
                        <ScrollReveal variant="fade-right">
                            <h3 className="text-2xl font-bold text-foreground leading-tight font-heading mb-6">
                                {title}
                            </h3>
                            <p className="text-muted-foreground text-base font-body leading-relaxed mb-6">
                                {description}
                            </p>
                            <p className="text-muted-foreground text-sm font-bold">
                                Modern Web, Cloud, and Automation Technologies
                            </p>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden">
                    {/* Fade overlays on edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#01010e] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#01010e] to-transparent z-10 pointer-events-none" />

                    <div className="flex animate-marquee hover:pause-marquee items-center">
                        {duplicatedItems.map((item, index) => (
                            <div
                                key={`${item.name || item.id}-${index}`}
                                className="flex-shrink-0 mx-8 md:mx-12"
                            >
                                {item.type === 'image' ? (
                                    <div className="relative gray-0 opacity-80 hover:opacity-100 transition-all duration-500 dark:invert-0 invert flex items-center justify-center h-[50px] w-auto">
                                        <Image
                                            src={item.logo_url}
                                            alt={item.name}
                                            width={140}
                                            height={60}
                                            className="max-w-[120px] md:max-w-[140px] h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                        <span className={`text-3xl font-bold text-foreground tracking-tight whitespace-nowrap ${item.name === 'Salesforce' ? 'italic' : ''}`}>
                                            {item.name}
                                        </span>
                                        <span className="text-xs font-mono text-muted-foreground uppercase border border-border rounded px-2 py-1 whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    </div>
                                )}
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
                    animation: marquee 40s linear infinite;
                }

                .pause-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}
