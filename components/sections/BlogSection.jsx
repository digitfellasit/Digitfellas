'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BlogSection({ posts = [] }) {
    // Show only 3 latest posts
    const displayPosts = posts.slice(0, 3)

    return (
        <section className="relative w-full bg-white text-black pt-[160px] pb-[160px] md:pt-[90px] md:pb-[90px] overflow-hidden">

            <div className="container relative z-10 max-w-[1248px] mx-auto px-10">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-[60px]"
                >
                    <div className="mb-6 md:mb-0">
                        <span className="text-[#ffffff] font-semibold tracking-wider uppercase text-sm mb-4 block">
                            Our News
                        </span>
                        <h3 className="text-4xl md:text-[46px] font-bold font-heading leading-tight">
                            From the Blog
                        </h3>
                    </div>

                    <Link
                        href="/blog"
                        className="inline-flex items-center bg-[#ffffff] text-white px-8 py-4 rounded-[5px] font-bold text-sm tracking-wide hover:bg-black transition-colors"
                    >
                        VIEW ALL
                    </Link>
                </motion.div>

                {/* BLOG GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
                    {displayPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.3, delay: index * 0.15 }}
                            className="group flex flex-col"
                        >
                            {/* Image */}
                            <div className="w-full aspect-[100/83] overflow-hidden rounded-[5px] mb-8 relative bg-gray-100">
                                <Link href={`/blog/${post.slug}`}>
                                    <img
                                        src={post.featured_image?.url || '/images/placeholder-blog.jpg'}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </Link>
                            </div>

                            {/* Content */}
                            <h5 className="text-xl font-bold mb-4 font-heading group-hover:text-[#ffffff] transition-colors leading-tight">
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h5>

                            <p className="text-gray-500 text-[15px] leading-[26px] mb-6 line-clamp-3">
                                {post.short_description || post.excerpt || "No description available."}
                            </p>

                            {/* Separator */}
                            <div className="w-full h-px bg-gray-200 mb-6" />

                            {/* Button */}
                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex items-center text-black font-bold text-sm tracking-wide group/btn hover:text-[#ffffff] transition-colors"
                            >
                                <span className="border-b-2 border-transparent group-hover/btn:border-[#ffffff] pb-1 transition-all">Read article</span>
                                <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}

                    {displayPosts.length === 0 && (
                        <div className="col-span-3 text-center py-10 text-gray-400">
                            No blog posts found.
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}
