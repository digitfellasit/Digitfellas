'use client'
import Image from 'next/image'

export function HeroSection({ hero, className = '' }) {
    if (!hero) return null;

    const desktopMedia = hero.media?.find(m => m.variant === 'desktop');
    const mobileMedia = hero.media?.find(m => m.variant === 'mobile') || desktopMedia;

    return (
        <section className={`relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden ${className}`}>
            <div className='absolute inset-0 z-0'>
                <div className='block md:hidden w-full h-full relative'>
                    {mobileMedia && <img src={mobileMedia.url} alt={hero.title || 'Hero'} className='w-full h-full object-cover' />}
                    {!mobileMedia && <div className='w-full h-full bg-muted/80' />}
                </div>
                <div className='hidden md:block w-full h-full relative'>
                    {desktopMedia && <img src={desktopMedia.url} alt={hero.title || 'Hero'} className='w-full h-full object-cover' />}
                    {!desktopMedia && <div className='w-full h-full bg-muted/80' />}
                </div>
                <div className='absolute inset-0 bg-black/40' />
            </div>
            <div className='relative z-10 container text-center text-white px-4'>
                {hero.title && <h1 className='text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-md'>{hero.title}</h1>}
                {hero.subtitle && <p className='text-lg md:text-2xl opacity-90 font-light max-w-2xl mx-auto drop-shadow-md'>{hero.subtitle}</p>}
            </div>
        </section>
    )
}