'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HeroSection({ hero, className = '' }) {
    const { scrollY } = useScroll()
    const backgroundY = useTransform(scrollY, [0, 1000], [0, 400])

    if (!hero) return null;

    const desktopMedia = hero.media?.find(m => m.variant === 'desktop');
    const mobileMedia = hero.media?.find(m => m.variant === 'mobile') || desktopMedia;
    const fallbackImage = '/uploads/placeholder-hero.jpg';

    return (
        <section className={`relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden ${className}`}>
            <div className='absolute inset-0 z-0 overflow-hidden'>
                {/* Parallax Wrapper */}
                <motion.div
                    className='absolute inset-0 w-full h-[120%]'
                    style={{ y: backgroundY }}
                >
                    <div className='hidden md:block w-full h-full relative'>
                        <Image
                            src={desktopMedia?.url || fallbackImage}
                            alt={hero.title || 'Hero'}
                            fill
                            priority
                            className='object-cover'
                            sizes="100vw"
                        />
                    </div>
                    {/* Mobile Image Logic if needed, currently reusing desktop logic structure */}
                    <div className='block md:hidden w-full h-full relative'>
                        <Image
                            src={mobileMedia?.url || desktopMedia?.url || fallbackImage}
                            alt={hero.title || 'Hero'}
                            fill
                            priority
                            className='object-cover'
                            sizes="100vw"
                        />
                    </div>
                </motion.div>
                <div className='absolute inset-0 bg-black/40 z-10' />
            </div>
            <div className='relative z-20 container text-center text-white px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {hero.title && <h1 className='text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-md'>{hero.title}</h1>}
                    {hero.subtitle && <p className='text-lg md:text-2xl opacity-90 font-light max-w-2xl mx-auto drop-shadow-md'>{hero.subtitle}</p>}
                </motion.div>
            </div>
        </section>
    )
}