'use client'

import { motion } from 'framer-motion'
import { useTechStack } from '@/lib/homepage-hooks'

export function TechStackSection() {
    const { data: techStack = [], isLoading } = useTechStack()

    if (isLoading || techStack.length === 0) return null

    // Group by category
    const grouped = techStack.reduce((acc, tech) => {
        const cat = tech.category || 'other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(tech)
        return acc
    }, {})

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Tech Stack</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Cutting-edge technologies we work with
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {Object.entries(grouped).map(([category, items], catIndex) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 text-center">
                                {category}
                            </h3>
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {items.map((tech, index) => (
                                    <motion.div
                                        key={tech.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        className="group"
                                    >
                                        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center aspect-square hover:border-primary/50 transition-all duration-300 hover:shadow-lg grayscale hover:grayscale-0">
                                            <img
                                                src={tech.icon_url}
                                                alt={tech.name}
                                                className="w-12 h-12 object-contain mb-3"
                                            />
                                            <span className="text-xs font-medium text-center">{tech.name}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
