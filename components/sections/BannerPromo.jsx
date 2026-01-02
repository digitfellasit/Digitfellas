'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function BannerPromo() {
    return (
        <section className="relative w-full overflow-hidden min-h-[500px]">
            {/* Background Layer with Blend Mode */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'linear-gradient(180deg, rgba(46, 16, 101, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
                        mixBlendMode: 'multiply'
                    }}
                />
                <Image
                    src="https://avada.website/programmer/wp-content/uploads/sites/179/2023/05/banner-1.jpg"
                    alt="Banner Background"
                    fill
                    className="object-cover object-right-top grayscale opacity-50"
                    sizes="100vw"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-20 container max-w-[1248px] mx-auto px-10 py-[10vw]">
                <div className="flex flex-col md:flex-row">

                    {/* 2/3 Column */}
                    <ScrollReveal
                        variant="fade-up"
                        className="w-full md:w-2/3"
                    >
                        <span className="text-[#ffffff] font-semibold tracking-wider uppercase text-sm mb-6 block">
                            Digifellas
                        </span>

                        <h1 className="text-4xl md:text-[56px] leading-[1.1] font-bold text-white mb-8 font-heading">
                            Hello! We are a creative digital agency dealing with clean code.
                        </h1>

                        <p className="text-gray-300 text-[18px] leading-[30px] mb-10 max-w-[80%]">
                            We help you digitally transform your business. We are a team of passionate developers and designers who love to create amazing digital experiences.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/projects"
                                className="inline-flex items-center bg-[#ffffff] text-black px-8 py-4 rounded-[5px] font-bold text-sm tracking-wide hover:bg-white transition-colors shadow-lg"
                            >
                                VIEW PROJECT
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex items-center bg-transparent border border-white text-white px-8 py-4 rounded-[5px] font-bold text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
                            >
                                CONTACT US
                            </Link>
                        </div>

                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}
