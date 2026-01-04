'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function HowWeWorkSection() {
    const pillars = [
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
    ]

    return (
        <section className="relative w-full bg-background text-foreground py-24 md:py-32 overflow-hidden transition-colors duration-300">
            {/* Background Image Optimization - Using native img for SVG background to avoid null response errors */}
            <div className="absolute inset-0 z-0 opacity-40 dark:opacity-40 opacity-5">
                <img
                    src="/images/hero-bg.svg"
                    alt=""
                    className="w-full h-full object-cover opacity-60 dark:invert-0 invert"
                />
                <div className="absolute inset-0 bg-background/60" />
            </div>

            <div className="container relative z-10 max-w-[1248px] mx-auto px-6">
                <ScrollReveal variant="fade-up" className="mb-16 text-left">
                    {/* Swapped Hierarchy as requested */}
                    <h3 className="text-3xl md:text-5xl font-bold text-foreground leading-tight font-heading mb-6">
                        How We Work
                    </h3>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
                        We engage as a long-term technology partner, not a task-based vendor.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {pillars.map((pillar, index) => (
                        <ScrollReveal
                            key={index}
                            variant="fade-up"
                            delay={index * 200}
                            // Key Style Match: ServicesPromo Card Styling
                            className="bg-card p-[48px] rounded-[5px] transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:bg-secondary shadow-lg border border-border group flex flex-col h-full"
                        >
                            {/* Number */}
                            <span className="text-foreground text-5xl font-bold font-heading mb-6 block opacity-50 group-hover:opacity-100 transition-opacity">
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            {/* No Icon as requested */}

                            {/* Title */}
                            <h3 className="text-2xl font-bold mb-4 font-heading group-hover:text-foreground transition-colors">
                                {pillar.title}
                            </h3>

                            {/* Description */}
                            <p className="text-muted-foreground text-[15px] leading-[26px] flex-grow">
                                {pillar.description}
                            </p>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Section CTA */}
                <div className="text-center">
                    <ScrollReveal variant="fade-up" delay={400}>
                        <Link
                            href="/how-we-work"
                            className="inline-flex items-center gap-2 text-foreground font-bold text-lg hover:text-muted-foreground transition-colors group"
                        >
                            Learn more about how we work
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </ScrollReveal>
                </div>

            </div>
        </section>
    )
}
