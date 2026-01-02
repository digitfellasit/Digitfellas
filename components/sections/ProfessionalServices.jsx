'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function ProfessionalServices() {
    return (
        <section className="relative w-full overflow-hidden bg-transparent pt-[95px] pb-[180px] md:pt-[90px] md:pb-[90px]">
            {/* Max width container: 1200px + 80px = 1280px roughly, or use container logic */}
            <div className="container relative z-10 max-w-[1280px] mx-auto px-10">
                <div className="flex flex-col lg:flex-row items-center">

                    {/* LEFT COLUMN (40%) */}
                    {/* Animation: FadeInLeft (1.3s) - assuming standard duration/ease from previous sections */}
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.3, ease: "easeOut" }}
                        className="w-full lg:w-[40%] mb-12 lg:mb-0 relative"
                    >
                        <div className="relative rounded-[5px] overflow-hidden shadow-2xl">
                            <img
                                src="https://avada.website/programmer/wp-content/uploads/sites/179/2023/05/info-2.jpg"
                                alt="Professional Programming"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN (60%) */}
                    {/* Left spacing: calc(0.166 * (100% - 80px)) approx 16.6% margin-left relative to remaining space or just padding-left */}
                    <div className="w-full lg:w-[60%] lg:pl-[8%] xl:pl-[10%]">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
                        >
                            {/* H2 Title */}
                            <h2 className="text-4xl md:text-[46px] leading-tight font-bold text-white mb-6 font-heading">
                                Professional Programming <br className="hidden md:block" /> Services You Can Trust
                            </h2>

                            {/* Paragraph */}
                            <p className="text-gray-400 text-[15px] leading-[22px] mb-8 lg:mr-[15%]">
                                We help you digitally transform your business with our expertise in software engineering and design. Our team is dedicated to providing high-quality code and creative solutions.
                            </p>

                            {/* Separator */}
                            <div className="w-full h-px bg-[#ffffff]/30 my-[25px] mb-[60px]" />

                            {/* Inner Row: Two Columns */}
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Inner Column 1 */}
                                <div className="w-full md:w-1/2">
                                    <h5 className="text-white text-xl font-bold mb-3 font-heading">High Quality Code</h5>
                                    <p className="text-gray-400 text-[15px] leading-[22px] mb-4">
                                        We ensure every line of code is clean, efficient, and scalable. Quality is our top priority for every project.
                                    </p>
                                    <Link href="/services" className="inline-flex items-center text-[#ffffff] hover:text-white transition-colors relative group font-bold text-sm tracking-wide">
                                        <span className="border-b border-[#ffffff] group-hover:border-white pb-0.5 transition-colors">Learn about creation</span>
                                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                {/* Inner Column 2 */}
                                <div className="w-full md:w-1/2">
                                    <h5 className="text-white text-xl font-bold mb-3 font-heading">Creative Design</h5>
                                    <p className="text-gray-400 text-[15px] leading-[22px] mb-4">
                                        Our designs are not just visually appealing but also user-centric, ensuring the best experience for your customers.
                                    </p>
                                    <Link href="/projects" className="inline-flex items-center text-[#ffffff] hover:text-white transition-colors relative group font-bold text-sm tracking-wide">
                                        <span className="border-b border-[#ffffff] group-hover:border-white pb-0.5 transition-colors">Learn about design</span>
                                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
