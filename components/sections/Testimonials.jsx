'use client'

import { motion } from 'framer-motion'
import { useTestimonials } from '@/lib/homepage-hooks'
import { StarRating } from '@/components/ui/StarRating'
import { Quote } from 'lucide-react'

export function TestimonialsSection() {
    const { data: testimonials = [], isLoading } = useTestimonials()

    if (isLoading || testimonials.length === 0) return null

    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-[#3B82F6] font-semibold tracking-wider uppercase text-sm mb-4 block">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">What Clients Say</h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Trusted by businesses worldwide
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.slice(0, 6).map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group h-full"
                        >
                            <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-10 h-full hover:border-purple-500/30 transition-all duration-300 hover:bg-[#121212] hover:shadow-2xl hover:-translate-y-1 relative">

                                {/* Quote Icon */}
                                <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Quote className="w-12 h-12 text-white" />
                                </div>

                                {/* Rating */}
                                <div className="mb-6 text-[#ffffff]">
                                    <StarRating rating={testimonial.rating} size={20} />
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-gray-300 leading-relaxed mb-8 relative z-10">
                                    "{testimonial.testimonial_text}"
                                </p>

                                {/* Client Info */}
                                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                    {testimonial.client_image_url ? (
                                        <img
                                            src={testimonial.client_image_url}
                                            alt={testimonial.client_name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/5"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                            {testimonial.client_name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-white group-hover:text-[#3B82F6] transition-colors">{testimonial.client_name}</div>
                                        <div className="text-sm text-gray-500">
                                            {testimonial.client_role}
                                            {testimonial.client_company && ` at ${testimonial.client_company}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
