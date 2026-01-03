'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function BlogSection({ posts = [] }) {
    // Show only 3 latest posts
    const displayPosts = posts.slice(0, 3)

    return (
        <section className="relative w-full bg-white text-black pt-[80px] pb-[80px] md:pt-[120px] md:pb-[120px] lg:pt-[160px] lg:pb-[160px] overflow-hidden">
            <div className="container relative z-10 max-w-[1248px] mx-auto px-4 md:px-6 lg:px-10">

                {/* HEADER */}
                <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row justify-between items-end mb-[60px]">
                    <div className="mb-6 md:mb-0">
                        <span className="text-[#000000] font-semibold tracking-wider uppercase text-sm mb-4 block">
                            Our News
                        </span>
                        <h3 className="text-3xl md:text-4xl lg:text-[46px] font-bold font-heading leading-tight text-black">
                            From the Blog
                        </h3>
                    </div>

                    <Link
                        href="/blog"
                        className="inline-flex items-center bg-black text-white px-8 py-4 rounded-[5px] font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
                    >
                        VIEW ALL
                    </Link>
                </ScrollReveal>

                {/* BLOG GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-[40px]">
                    {displayPosts.map((post, index) => (
                        <ScrollReveal
                            key={post.id}
                            variant="fade-up"
                            delay={index * 150}
                            className="group flex flex-col"
                        >
                            {/* Image */}
                            <div className="w-full aspect-[100/83] overflow-hidden rounded-[5px] mb-8 relative bg-gray-100">
                                <Link href={`/blog/${post.slug}`} className="block w-full h-full">
                                    <Image
                                        src={post.featured_image?.url || '/images/placeholder-blog.jpg'}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </Link>
                            </div>

                            {/* Content */}
                            <h5 className="text-xl font-bold mb-4 font-heading group-hover:text-primary transition-colors leading-tight">
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h5>

                            <p className="text-gray-500 text-[15px] leading-[26px] mb-6 line-clamp-3">
                                {(post.short_description || post.excerpt || "No description available.").slice(0, 120) + ((post.short_description || post.excerpt || "").length > 120 ? '...' : '')}
                            </p>

                            {/* Separator */}
                            <div className="w-full h-px bg-gray-200 mb-6" />

                            {/* Button */}
                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex items-center text-black font-bold text-sm tracking-wide group/btn hover:text-primary transition-colors"
                            >
                                <span className="border-b-2 border-transparent group-hover/btn:border-primary pb-1 transition-all">Read article</span>
                                <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </ScrollReveal>
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
