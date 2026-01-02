'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AboutSection() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Parallax effect: Translate Y from 0 to 95px based on scroll
    const y = useTransform(scrollYProgress, [0, 1], [0, 95])

    return (
        <section ref={containerRef} className="relative w-full bg-black text-white pt-[160px] pb-[160px] md:pt-[90px] md:pb-[90px] overflow-hidden">

            <div className="container relative z-10 max-w-[1248px] mx-auto px-10">
                <div className="flex flex-col md:flex-row items-center gap-[50px] md:gap-[4%]">

                    {/* LEFT COLUMN (Text) - 50% */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.3, ease: "easeOut" }}
                        className="w-full md:w-[48%]"
                    >
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
                    </motion.div>

                    {/* RIGHT COLUMN (Image) - 50% */}
                    <div className="w-full md:w-[48%] relative">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.3, delay: 0.3 }}
                            style={{ y }} // Apply parallax transform
                        >
                            <div className="relative rounded-[5px] overflow-hidden shadow-2xl">
                                <img
                                    src="https://avada.website/programmer/wp-content/uploads/sites/179/2023/05/info-10.jpg"
                                    alt="About Digifellas"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
