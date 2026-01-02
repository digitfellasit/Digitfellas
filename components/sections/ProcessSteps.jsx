'use client'

import { useProcessSteps } from '@/lib/homepage-hooks'
import * as LucideIcons from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function ProcessStepsSection() {
    const { data: steps = [], isLoading } = useProcessSteps()

    if (isLoading || steps.length === 0) return null

    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Background radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#050505]" />

            <div className="container relative z-10">
                <ScrollReveal
                    variant="fade-up"
                    className="text-center mb-20"
                >
                    <span className="text-[#ffffff] font-semibold tracking-wider uppercase text-sm mb-4 block">Work Process</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Discover What We Do <br /> And How We Do It
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Our streamlined process ensures transparency and quality at every step of the development lifecycle.
                    </p>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => {
                        const Icon = LucideIcons[step.icon_name] || LucideIcons.Zap

                        return (
                            <ScrollReveal
                                key={step.id}
                                variant="fade-up"
                                delay={index * 150}
                                className="relative group h-full"
                            >
                                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 h-full hover:border-[#ffffff]/30 transition-all duration-300 hover:bg-[#121212] relative overflow-hidden flex flex-col items-center text-center group-hover:-translate-y-2">

                                    {/* Step Number */}
                                    <div className="text-sm font-bold tracking-widest text-[#ffffff] mb-6 uppercase border border-[#ffffff]/20 px-3 py-1 rounded-full bg-[#ffffff]/5">
                                        Step {String(step.step_number).padStart(2, '0')}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 group-hover:bg-gradient-to-br group-hover:from-[#ffffff] group-hover:to-[#CA9A04]">
                                        <Icon className="w-8 h-8" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold mb-4 text-white font-heading">{step.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </ScrollReveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
