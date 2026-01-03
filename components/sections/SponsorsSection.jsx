'use client'

import Image from 'next/image'
import { useClientLogos } from '@/lib/homepage-hooks'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function SponsorsSection() {
    const { data: logos = [], isLoading } = useClientLogos()

    if (isLoading) return null
    if (!logos.length) return null

    return (
        <section className="relative w-full overflow-hidden bg-transparent pt-[95px] pb-0">
            <div className="container relative z-10 max-w-[1248px] mx-auto px-4">
                <ScrollReveal variant="fade-up" stagger staggerDelay={100}>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        {logos.map((logo) => (
                            <div
                                key={logo.id}
                                className="flex justify-center items-center"
                            >
                                <div className="relative group flex justify-center">
                                    <Image
                                        src={logo.logo_url}
                                        alt={logo.name}
                                        width={171}
                                        height={52}
                                        className="max-w-[120px] md:max-w-[171px] max-h-[52px] w-auto h-auto object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
