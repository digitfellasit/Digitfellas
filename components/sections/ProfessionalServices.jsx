'use client'

import { useRef, useEffect } from 'react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function ProfessionalServices({ services = [] }) {
    const scrollRef = useRef(null)

    // Auto-scroll logic for mobile
    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return

        let scrollInterval

        const startAutoScroll = () => {
            scrollInterval = setInterval(() => {
                if (!scrollContainer) return

                const cardWidth = scrollContainer.offsetWidth
                const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth

                // If we are at the end, scroll back to start, otherwise scroll to next card
                if (scrollContainer.scrollLeft >= maxScrollLeft - 10) { // -10 tolerance
                    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' })
                } else {
                    scrollContainer.scrollBy({ left: cardWidth, behavior: 'smooth' })
                }
            }, 3000) // Scroll every 3 seconds
        }

        // Start initially
        startAutoScroll()

        // Pause on interaction
        const stopAutoScroll = () => clearInterval(scrollInterval)

        scrollContainer.addEventListener('touchstart', stopAutoScroll)
        scrollContainer.addEventListener('touchend', startAutoScroll) // Restart after touch
        scrollContainer.addEventListener('mouseenter', stopAutoScroll)
        scrollContainer.addEventListener('mouseleave', startAutoScroll)

        return () => {
            clearInterval(scrollInterval)
            if (scrollContainer) {
                scrollContainer.removeEventListener('touchstart', stopAutoScroll)
                scrollContainer.removeEventListener('touchend', startAutoScroll)
                scrollContainer.removeEventListener('mouseenter', stopAutoScroll)
                scrollContainer.removeEventListener('mouseleave', startAutoScroll)
            }
        }
    }, [])

    return (
        <section className="relative w-full bg-background pt-0 pb-24 transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="max-w-3xl mb-16 text-left">
                    <ScrollReveal variant="fade-up">
                        <h3 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                            What We Build and Support
                        </h3>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            We focus on engineering outcomes, not surface-level deliverables. Our capabilities span product engineering, enterprise platforms, AI-driven automation, and security assurance.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Capability Cards
                    Mobile: Horizontal Scroll Snap (Carousel - One at a time) + Auto Scroll
                    Desktop: Grid (4 Columns)
                */}
                <div
                    ref={scrollRef}
                    className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-6 pb-0 -mx-6 px-6 lg:mx-0 lg:px-0 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar Firefox/IE
                >
                    {services.map((service, index) => (
                        <div
                            key={service.id || index}
                            className="min-w-[100%] lg:min-w-0 snap-center h-full"
                        >
                            <ScrollReveal
                                variant="fade-up"
                                delay={index * 100}
                                className="h-full"
                            >
                                <div className="group h-full p-8 rounded-3xl bg-card border border-border hover:border-primary/30 hover:bg-secondary transition-all duration-500 relative overflow-hidden text-left shadow-sm">
                                    {/* Subtle Gradient Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/5 transition-all duration-500" />

                                    <div className="relative z-10">
                                        <h4 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h4>
                                        <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground transition-colors">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
                {/* CSS to hide webkit scrollbar */}
                <style jsx global>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

            </div>
        </section>
    )
}
