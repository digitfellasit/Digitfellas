'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

// Text Slide Up Button Component
function SlideButton({ href, text }) {
    const buttonTextVariants = {
        initial: { y: 0 },
        hover: { y: -25 },
    }
    const secondTextVariants = {
        initial: { y: 25 },
        hover: { y: 0 },
    }

    return (
        <Link href={href || '#'}>
            <motion.div
                className="relative overflow-hidden border-2 border-[#83868a] text-[#1a73e8] hover:text-white dark:border-foreground dark:text-foreground dark:hover:text-background hover:bg-[#1a73e8] dark:hover:bg-foreground transition-colors rounded-full px-[35px] py-[15px] font-bold text-sm uppercase tracking-wide cursor-pointer h-[54px] flex items-center justify-center min-w-[300px]"
                initial="initial"
                whileHover="hover"
            >
                <div className="relative overflow-hidden h-5 w-full flex flex-col items-center">
                    <motion.span variants={buttonTextVariants} className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
                        {text || 'Learn More'}
                    </motion.span>
                    <motion.span variants={secondTextVariants} className="absolute inset-0 flex items-center justify-center translate-y-full whitespace-nowrap">
                        {text || 'Learn More'}
                    </motion.span>
                </div>
            </motion.div>
        </Link>
    )
}

// Typing Text Component
function TypingText({ words = [] }) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (!words.length) return
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length)
        }, 2600) // 2.6s as per spec
        return () => clearInterval(interval)
    }, [words])

    if (!words.length) return null

    return (
        <span className="inline-block min-w-[200px] text-left text-foreground relative">
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -10, rotateX: 90 }}
                    transition={{ duration: 0.3 }} // Fast typeIn/typeOut
                    className="inline-block origin-bottom"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

export function HeroSection({ hero }) {
    // 1. Content Parsing
    const {
        title,
        subtitle,
        kicker,
        media = [],
        primary_cta_label,
        primary_cta_url
    } = hero || {}

    const parsedTitle = useMemo(() => {
        if (!title) return {
            prefix: "Software Engineering for Reliable, Long-Term Digital Systems.",
            typing: [],
            suffix: ""
        }

        if (title.includes('|')) {
            const parts = title.split('|').map(s => s.trim())
            return {
                prefix: parts[0] || "",
                typing: parts[1] ? parts[1].split(',').map(s => s.trim()) : [],
                suffix: parts[2] || ""
            }
        }

        return {
            prefix: title,
            typing: [],
            suffix: ""
        }
    }, [title])

    // Images
    const allMedia = hero?.media || []

    // We only use the first image now as per redesign
    const image1 = media[0]?.url

    return (
        <section
            className="relative w-full overflow-hidden bg-background"
        >
            {/* Background Layer (Restored from previous style / copied from How We Work) */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'linear-gradient(180deg, rgba(46, 16, 101, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
                        mixBlendMode: 'multiply'
                    }}
                />
                <Image
                    src="/images/Hero_Background.webp"
                    alt="Hero Background"
                    fill
                    className="object-cover object-right-top grayscale opacity-50"
                    sizes="100vw"
                    priority
                />

                {/* Fade to Next Section */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
            </div>

            <div className="container relative z-10 max-w-[1248px] px-6 lg:px-10">{/* Max row width 1248px */}
                <div className="flex flex-col lg:flex-row items-center pt-[140px] pb-[60px] md:pt-[110px] md:pb-[40px]">

                    {/* LEFT COLUMN (50%) */}
                    {/* Animation: FadeInLeft (1.3s) */}
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.3, ease: "easeOut" }}
                        className="w-full lg:w-1/2 flex flex-col items-start text-left lg:pr-10 mb-12 lg:mb-0 relative z-20"
                    >
                        {/* Kicker Removed from Top */}

                        {/* Main Heading H1 */}
                        <h1 className="text-3xl md:text-3xl lg:text-5xl font-extrabold text-white mb-6 md:mb-8 font-heading tracking-tight leading-tight">
                            {parsedTitle.prefix}
                            {parsedTitle.typing.length > 0 && <br className="hidden md:block" />}
                            {parsedTitle.typing.length > 0 && <TypingText words={parsedTitle.typing} />}
                            {parsedTitle.suffix && <br className="hidden md:block" />}
                            {parsedTitle.suffix}
                        </h1>

                        {/* Description Paragraph */}
                        <p className="text-white/80 text-base leading-relaxed mb-[40px] lg:mr-[10%] max-w-2xl">
                            {subtitle || 'We build digital products that help businesses grow. From simple websites to complex web applications, we deliver quality code provided by the best experts in the field.'}
                        </p>

                        {/* Kicker: Moved Below Content, Smaller Text */}
                        <div className="mb-[40px] relative inline-block">
                            <span className="text-white/60 font-semibold tracking-widest text-xs uppercase border-b border-white/20 pb-1">
                                {kicker || 'Digitfellas'}
                            </span>
                        </div>

                        {/* CTA Button */}
                        <SlideButton
                            href={primary_cta_url || "/services"}
                            text={primary_cta_label || "Start a conversation"}
                        />
                    </motion.div>

                    {/* RIGHT COLUMN (50%) */}
                    {/* Animation: FadeInRight (1.3s) */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.3, ease: "easeOut" }}
                        className="hidden lg:flex w-full lg:w-1/2 relative min-h-[400px] md:min-h-[500px] lg:h-[600px] items-center justify-center lg:pl-10 mt-8 lg:mt-0"
                    >
                        {/* Right Column Background - Removed per user request */}

                        <div className="relative w-full h-full flex items-center justify-center lg:justify-end">
                            <motion.div
                                className="relative w-full z-20 aspect-[16/10]"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative overflow-hidden rounded-[1rem] lg:rounded-[1.5rem] shadow-2xl bg-card w-full h-full"
                                >
                                    <Image
                                        src={media[0]?.url || '/uploads/placeholder-hero.jpg'}
                                        alt="Main Feature"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 55vw"
                                        priority
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section >
    )
}
