'use client'

import { motion } from 'framer-motion'
import { Laptop, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function ServicesPromo({ services = [] }) {
    // Take the first 3 services to display
    const promoServices = services.slice(0, 3)

    return (
        <section className="relative w-full bg-black text-white pt-[95px] pb-[160px] md:pt-[90px] md:pb-[90px] overflow-hidden">
            {/* Background SVG */}
            <div className="absolute inset-0 z-0 opacity-40">
                <img
                    src="/images/hero-bg.svg"
                    alt="Background Pattern"
                    className="w-full h-full object-cover opacity-60"
                />
                {/* Dark overlay to ensure text readability if SVG is too bright */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="container relative z-10 max-w-[1248px] mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {promoServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 60, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.3 }}
                            className="bg-[#1a1a1a] p-[48px] rounded-[5px] transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:bg-[#222] shadow-2xl group flex flex-col"
                        >
                            {/* Number */}
                            <span className="text-[#ffffff] text-5xl font-bold font-heading mb-6 block opacity-50 group-hover:opacity-100 transition-opacity">
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            {/* Icon */}
                            <div className="w-[82px] h-[82px] rounded-[15%] bg-[#121212] flex items-center justify-center mb-8 group-hover:bg-[#ffffff] transition-colors duration-300 overflow-hidden">
                                {service.icon_url ? (
                                    <img src={service.icon_url} alt="" className="w-10 h-10 object-contain invert group-hover:invert-0 transition-all" />
                                ) : (
                                    <Laptop className="w-10 h-10 text-white group-hover:text-black transition-colors" />
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold mb-4 font-heading group-hover:text-[#ffffff] transition-colors">
                                {service.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-400 text-[15px] leading-[26px] mb-8 flex-grow">
                                {service.short_description || service.description || "No description available."}
                            </p>

                            {/* Button */}
                            <Link
                                href={`/services/${service.slug}`}
                                className="inline-flex items-center text-white font-bold text-sm tracking-wide bg-[#121212] px-6 py-3 rounded-b-[12px] rounded-t-[4px] self-start group-hover:bg-[#ffffff] group-hover:text-black transition-all"
                            >
                                View details
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </motion.div>
                    ))}

                    {promoServices.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500">
                            No services available to display.
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
