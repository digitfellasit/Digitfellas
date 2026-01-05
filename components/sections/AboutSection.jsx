'use client'

import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export function AboutSection({ data }) {
    const {
        title = "Experience Shapes Our Approach",
        description_1 = "With over 20 years in the software industry, we’ve worked across technologies, platforms, and business cycles. We’ve seen what scales, what breaks, and what quietly becomes expensive over time.",
        description_2 = "That experience informs how we work today — prioritizing clarity over complexity, structure over shortcuts, and systems that remain dependable long after launch.",
        principles = [
            "Senior-led engineering and decision-making",
            "Architecture-first thinking with governance in mind",
            "Clear communication across technical and business stakeholders"
        ],
        years_count = "20+",
        years_label = "Years of Experience",
        image_url
    } = data || {}

    return (
        <section id="about" className="py-20 md:py-32 bg-background transition-colors duration-300">
            <div className="container px-6 mx-auto">
                <div className="flex flex-col-reverse lg:flex-row lg:items-stretch gap-16">

                    {/* Left Column: Text Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <ScrollReveal variant="fade-right">
                            <h3 className="text-3xl md:text-3xl font-bold text-foreground leading-tight mb-8 text-left">
                                {title}
                            </h3>

                            <div className="space-y-6 text-base text-muted-foreground leading-relaxed mb-10">
                                <p>{description_1}</p>
                                <p>{description_2}</p>
                            </div>

                            <hr className="border-border mb-10" />

                            <h4 className="text-2xl font-bold text-foreground mb-6">Key Principles</h4>
                            <ul className="space-y-4">
                                {Array.isArray(principles) && principles.map((principle, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <span className="text-muted-foreground text-base">{principle}</span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: Visual/Stats or Image */}
                    <div className="w-full lg:w-1/2 relative">
                        <ScrollReveal variant="fade-left" className="relative w-full h-full">
                            {image_url ? (
                                <div className="relative w-full aspect-square lg:aspect-auto lg:h-full rounded-3xl overflow-hidden shadow-none dark:shadow-2xl [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                                    <Image
                                        src={image_url}
                                        alt="Experience"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/10 rounded-[3rem] blur-3xl" />
                                    <div className="relative z-10 p-1 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden aspect-square flex flex-col items-center justify-center text-center p-12">
                                        <div className="text-[120px] font-bold text-foreground leading-none mb-2">{years_count}</div>
                                        <div className="text-2xl text-muted-foreground font-medium">{years_label}</div>
                                    </div>
                                </>
                            )}
                        </ScrollReveal>
                    </div>

                </div>
            </div>
        </section>
    )
}
