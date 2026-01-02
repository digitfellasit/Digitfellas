'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function AboutSection() {
    return (
        <section className="relative w-full bg-black text-white pt-[160px] pb-[160px] md:pt-[90px] md:pb-[90px] overflow-hidden">
            <div className="container relative z-10 max-w-[1248px] mx-auto px-10">
                <div className="flex flex-col md:flex-row items-center gap-[50px] md:gap-[4%]">

                    {/* LEFT COLUMN (Text) - 50% */}
                    <ScrollReveal variant="fade-right" className="w-full md:w-[48%]">
                        <span className="text-[#ffffff] font-semibold tracking-wider uppercase text-sm mb-4 block">
                            Digifellas
                        </span>

                        <h2 className="text-4xl md:text-[52px] leading-[1.1] font-bold text-white mb-8 font-heading">
                            Hello! We are a digital agency that helps your business to grow.
                        </h2>

                        <p className="text-gray-400 text-[16px] leading-[28px] mb-8">
                            We are a team of passionate developers and designers who love to create amazing digital experiences. We believe that great design and clean code are the keys to success in the digital world.
                        </p>

                        <Link
                            href="/about"
                            className="inline-flex items-center text-white font-bold text-sm tracking-wide group"
                        >
                            <span className="border-b-2 border-[#ffffff] group-hover:border-white pb-1 transition-colors">
                                Learn about our team
                            </span>
                            <ArrowRight className="w-5 h-5 ml-2 text-[#ffffff] group-hover:text-white transform group-hover:translate-x-1 transition-all" />
                        </Link>
                    </ScrollReveal>

                    {/* RIGHT COLUMN (Image) - 50% */}
                    <div className="w-full md:w-[48%] relative">
                        <ScrollReveal variant="fade-left" parallax={true} parallaxAmount={40}>
                            <div className="relative rounded-[5px] overflow-hidden shadow-2xl aspect-[4/3]">
                                <Image
                                    src="https://avada.website/programmer/wp-content/uploads/sites/179/2023/05/info-10.jpg"
                                    alt="About Digifellas"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </ScrollReveal>
                    </div>

                </div>
            </div>
        </section>
    )
}
