'use client'

import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function ProfessionalServices({ services = [] }) {
    // Auto-scroll logic removed for vertical stack layout

    return (
        <section className="relative w-full bg-background pt-16 md:pt-20 pb-24 transition-colors duration-300">
            <div className="container max-w-[1248px] mx-auto px-6">

                {/* Section Header */}
                <div className="max-w-3xl mx-auto mb-16 text-center">
                    <ScrollReveal variant="fade-up">
                        <h3 className="text-2xl md:text-2xl font-bold text-foreground leading-tight mb-6">
                            What We Build and Support
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            We focus on engineering outcomes, not surface-level deliverables. Our capabilities span product engineering, enterprise platforms, AI-driven automation, and security assurance.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Capability Cards
                    Mobile: Single Column (Vertical Stack)
                    Desktop: Grid (4 Columns)
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <ScrollReveal
                            key={service.id || index}
                            variant="fade-up"
                            delay={index * 100}
                            className="h-full"
                        >
                            <div className="group h-full p-8 rounded-3xl bg-card border border-border hover:border-primary/30 hover:bg-[#1a73e8] dark:hover:bg-secondary transition-all duration-500 relative overflow-hidden text-left shadow-sm">
                                {/* Subtle Gradient Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 dark:group-hover:from-primary/5 dark:group-hover:to-primary/5 transition-all duration-500" />

                                <div className="relative z-10">
                                    <h4 className="text-xl font-bold text-foreground mb-4 group-hover:text-white dark:group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-white dark:group-hover:text-foreground transition-colors">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

            </div>
        </section>
    )
}
