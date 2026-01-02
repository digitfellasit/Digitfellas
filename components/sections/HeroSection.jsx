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
                className="relative overflow-hidden border-2 border-[#ffffff] text-[#ffffff] hover:text-black hover:bg-[#ffffff] transition-colors rounded-full px-[35px] py-[15px] font-bold text-sm uppercase tracking-wide cursor-pointer h-[54px] flex items-center justify-center min-w-[200px]"
                initial="initial"
                whileHover="hover"
            >
                <div className="relative overflow-hidden h-5 w-full flex flex-col items-center">
                    <motion.span variants={buttonTextVariants} className="absolute inset-0 flex items-center justify-center">
                        {text || 'Learn More'}
                    </motion.span>
                    <motion.span variants={secondTextVariants} className="absolute inset-0 flex items-center justify-center translate-y-full">
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
        <span className="inline-block min-w-[200px] text-left text-[#ffffff] relative">
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
            prefix: "Hello! We Are A Group Of",
            typing: ["Skilled", "Talented", "Creative"],
            suffix: "Developers And Programmers."
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

    // Group images into sets (e.g., 3 images per set)
    const imageSets = useMemo(() => {
        if (allMedia.length === 0) return []
        const sets = []
        for (let i = 0; i < allMedia.length; i += 3) {
            sets.push(allMedia.slice(i, i + 3))
        }
        return sets
    }, [allMedia])

    const [setIndex, setSetIndex] = useState(0)

    useEffect(() => {
        if (imageSets.length <= 1) return
        const interval = setInterval(() => {
            setSetIndex((prev) => (prev + 1) % imageSets.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [imageSets])

    const currentSet = imageSets[setIndex] || []

    const image1 = media[0]?.url
    const image2 = media[1]?.url

    return (
        <section
            className="relative w-full overflow-hidden bg-[#0A0A0A]"
        >
            {/* Background Image Optimization - Using native img for SVG background to avoid null response errors */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero-bg.svg"
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container relative z-10 max-w-[1248px]">{/* Max row width 1248px */}
                <div className="flex flex-col lg:flex-row items-center pt-[140px] pb-[120px] md:pt-[110px] md:pb-[60px]">

                    {/* LEFT COLUMN (50%) */}
                    {/* Animation: FadeInLeft (1.3s) */}
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.3, ease: "easeOut" }}
                        className="w-full lg:w-1/2 flex flex-col items-start text-left lg:pr-[50px] mb-12 lg:mb-0 relative z-20"
                    >
                        {/* Kicker: Underlined */}
                        <div className="mb-[30px] relative inline-block">
                            <span className="text-[#ffffff] font-bold tracking-wide text-lg relative z-10 pb-1 border-b-2 border-[#ffffff]">
                                {kicker || 'Avada Programmer'}
                            </span>
                        </div>

                        {/* Main Heading H1 */}
                        <h1 className="text-4xl md:text-[46px] md:leading-[53px] font-bold text-white mb-6 font-heading">
                            {parsedTitle.prefix}
                            {parsedTitle.typing.length > 0 && <br className="hidden md:block" />}
                            {parsedTitle.typing.length > 0 && <TypingText words={parsedTitle.typing} />}
                            {parsedTitle.suffix && <br className="hidden md:block" />}
                            {parsedTitle.suffix}
                        </h1>

                        {/* Description Paragraph */}
                        <p className="text-gray-400 text-[15px] leading-[22px] mb-[40px] lg:mr-[15%]">
                            {subtitle || 'We build digital products that help businesses grow. From simple websites to complex web applications, we deliver quality code provided by the best experts in the field.'}
                        </p>

                        {/* CTA Button */}
                        <SlideButton
                            href={primary_cta_url || "/services"}
                            text={primary_cta_label || "Learn about our services"}
                        />
                    </motion.div>

                    {/* RIGHT COLUMN (50%) */}
                    {/* Animation: FadeInRight (1.3s) */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.3, ease: "easeOut" }}
                        className="w-full lg:w-1/2 relative min-h-[500px] lg:h-[600px] flex items-center justify-center pl-[0px] lg:pl-[70px] mt-10 lg:mt-0"
                    >
                        {/* Right Column Background */}
                        <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center rounded-2xl overflow-hidden">
                            <Image
                                src="https://avada.website/programmer/wp-content/uploads/sites/179/2023/05/background-3.jpg"
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Image Sets Cycle */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={setIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0"
                                >
                                    {/* Main Mockup (Image 1) */}
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] z-20"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            className="relative overflow-hidden rounded-[1.5rem] border border-white/20 shadow-[-10px_20px_40px_rgba(0,0,0,0.5)] bg-[#0f1419] aspect-[16/10]"
                                        >
                                            <Image
                                                src={currentSet[0]?.url || '/uploads/placeholder-hero.jpg'}
                                                alt="Main Feature"
                                                fill
                                                className="object-cover opacity-90"
                                                sizes="(max-width: 768px) 75vw, 35vw"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-transparent opacity-60" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Overlapping Card 1 (Image 2) */}
                                    <motion.div
                                        className="absolute top-4 right-0 w-[35%] z-30"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.1 }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, 10, 0] }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                            className="relative overflow-hidden rounded-xl border border-white/20 shadow-2xl aspect-square bg-[#0f1419]"
                                        >
                                            <Image
                                                src={currentSet[1]?.url || currentSet[0]?.url || '/uploads/placeholder-hero.jpg'}
                                                alt="Sub Feature"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 30vw, 15vw"
                                            />
                                        </motion.div>
                                    </motion.div>

                                    {/* Overlapping Card 2 (Image 3) */}
                                    <motion.div
                                        className="absolute bottom-8 left-0 w-[40%] z-40"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                            className="group relative"
                                        >
                                            {currentSet[2] ? (
                                                <div className="relative overflow-hidden rounded-xl border border-white/20 shadow-2xl aspect-square bg-[#0f1419]">
                                                    <Image
                                                        src={currentSet[2].url}
                                                        alt="Sub Feature 2"
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 35vw, 18vw"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e]/90 backdrop-blur-md shadow-2xl p-5">
                                                    <div className="flex gap-1.5 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-500/30" />
                                                        <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                                                        <div className="w-2 h-2 rounded-full bg-green-500/30" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="h-1 w-[80%] bg-blue-400/20 rounded-full" />
                                                        <div className="h-1 w-[60%] bg-purple-400/20 rounded-full" />
                                                        <div className="h-1 w-[90%] bg-green-400/20 rounded-full" />
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
