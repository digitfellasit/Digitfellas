'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function HowWeWorkSection({ data }) {
    const {
        title = "How We Work",
        subtitle = "We engage as a long-term technology partner, not a task-based vendor.",
        pillars = [
            {
                title: "Discovery & Audit First",
                description: "We begin by understanding business context, existing systems, constraints, and risks before proposing solutions."
            },
            {
                title: "Structured Delivery",
                description: "Clear milestones, documented decisions, and predictable execution — without unnecessary process overhead."
            },
            {
                title: "Long-Term Ownership",
                description: "We design systems with future teams, scale, audits, and evolution in mind."
            }
        ],
        cta_text = "Learn more about how we work",
        cta_link = "/how-we-work"
    } = data || {}

    return (
        <section id="how-we-work" className="py-24 md:py-32 bg-background transition-colors duration-300 relative overflow-hidden">
            {/* Background Layer (Re-added per user request with specific image) */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'linear-gradient(180deg, rgba(46, 16, 101, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
                        mixBlendMode: 'multiply'
                    }}
                />
                <Image
                    src="/images/banner-1.jpg"
                    alt="Work Banner"
                    fill
                    className="object-cover object-right-top grayscale opacity-50"
                    sizes="100vw"
                    priority
                />

                {/* Fade to Next Section */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
            </div>

            <div className="container relative z-10 max-w-[1248px] mx-auto px-6">
                <ScrollReveal variant="fade-up" className="mb-16 text-center">
                    <h3 className="text-3xl md:text-3xl font-bold text-white leading-tight font-heading mb-6">
                        {title}
                    </h3>
                    <p className="text-base text-white/80 max-w-2xl mx-auto font-body">
                        {subtitle}
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {Array.isArray(pillars) && pillars.map((pillar, index) => (
                        <ScrollReveal
                            key={index}
                            variant="fade-up"
                            delay={index * 200}
                            // Restored Glassmorphism Card Style
                            className="bg-white/5 backdrop-blur-sm p-[48px] rounded-xl transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:bg-[#1a73e8] shadow-lg border border-white/10 group flex flex-col h-full"
                        >
                            {/* Number */}
                            <span className="text-white/40 text-5xl font-bold font-heading mb-6 block group-hover:opacity-100 group-hover:text-white transition-all">
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            {/* Title */}
                            <h3 className="text-2xl font-bold mb-4 font-heading text-white transition-colors">
                                {pillar.title}
                            </h3>

                            {/* Description */}
                            <p className="text-white/70 text-base leading-[26px] flex-grow group-hover:text-white transition-colors">
                                {pillar.description}
                            </p>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Section CTA */}
                <div className="text-center">
                    <ScrollReveal variant="fade-up" delay={400}>
                        <Link
                            href={cta_link || "#"}
                            className="inline-flex items-center gap-2 text-white hover:text-white/80 font-bold text-base transition-colors group"
                        >
                            {cta_text}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </ScrollReveal>
                </div>

            </div>
        </section>
    )
}
