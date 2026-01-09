'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Instagram, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSite } from '@/lib/api-hooks'

const navigation = {
    main: [
        { name: 'About', href: '/about' },
        { name: 'Capabilities', href: '/#capabilities' },
        { name: 'How We Work', href: '/#how-we-work' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Insights', href: '/insights' },
        { name: 'Partnerships', href: '/#partnerships' },
        { name: 'Contact', href: '/contact' },
    ]
}

const getSocialIcon = (label) => {
    switch (label.toLowerCase()) {
        case 'facebook': return Facebook
        case 'twitter': return Twitter
        case 'linkedin': return Linkedin
        case 'instagram': return Instagram
        case 'whatsapp': return MessageCircle
        default: return null
    }
}

export function SiteFooter() {
    const pathname = usePathname()
    const { site } = useSite()

    if (pathname?.startsWith('/admin')) return null
    let socials = site?.footer?.socials || []

    // Ensure common socials are present even if not in DB
    const hasFB = socials.some(s => s.label.toLowerCase() === 'facebook')
    const hasIG = socials.some(s => s.label.toLowerCase() === 'instagram')
    const hasLinkedin = socials.some(s => s.label.toLowerCase() === 'linkedin')

    if (!hasFB) socials.push({ id: 'fb-fallback', label: 'Facebook', href: 'https://facebook.com/digitfellas' })
    if (!hasIG) socials.push({ id: 'ig-fallback', label: 'Instagram', href: 'https://instagram.com/digitfellas' })
    if(!hasLinkedin) socials.push({ id: 'linkedin-fallback', label: 'LinkedIn', href: 'https://linkedin.com/digitfellas' })
    // Sort to keep LinkedIn first if possible
    socials = socials.sort((a, b) => {
        if (a.label.toLowerCase() === 'linkedin') return -1
        if (b.label.toLowerCase() === 'linkedin') return 1
        return 0
    })

    return (
        <footer className="bg-[#01010e] text-foreground border-t border-border pt-24 pb-12 transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">

                    {/* Brand & Statement */}
                    <div className="md:col-span-5">
                        <Image
                            src="/images/digitfellas_logo.png"
                            alt="DigitFellas"
                            width={180}
                            height={40}
                            className="h-[40px] w-auto object-contain"
                            priority
                        />
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-8 mt-10">
                            Digitfellas is a software engineering firm focused on building reliable digital systems for long-term business value.
                        </p>

                        {/* Social Links */}
                        {socials.length > 0 && (
                            <div className="flex items-center gap-6">
                                {socials.map((social) => {
                                    const Icon = getSocialIcon(social.label)
                                    if (!Icon) return null
                                    return (
                                        <a
                                            key={social.id}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#83868a] hover:text-[#331676] transition-colors p-2 -ml-2"
                                            aria-label={social.label}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-7 flex flex-col items-start md:items-end">
                        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 text-left">
                            {navigation.main.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font transition-colors py-2 text-[#83868a] hover:text-[#331676] dark:text-foreground/80 dark:hover:text-primary"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-sm font-small">
                    <p>© {new Date().getFullYear()} Digitfellas. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}
