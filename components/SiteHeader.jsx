'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import {
    Menu, X, ChevronDown, ChevronRight, Code, Sun, Moon,
    Newspaper, Briefcase, Layout, Smartphone, Globe,
    Server, Cpu, Layers, Settings, Terminal, Database,
    Shield, BarChart3, Cloud, Search, Zap, MessageSquare, ArrowRight, LineChart
} from 'lucide-react'
import { m, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useNavigation, useSite, useServices, usePages } from '@/lib/api-hooks'


function cx(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function SiteHeader() {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isSticky, setIsSticky] = useState(false)
    const pathname = usePathname()

    // Hide global nav on admin pages
    if (pathname?.startsWith('/admin')) return null

    const [focusedItem, setFocusedItem] = useState(null)
    const { navigation } = useNavigation()
    const { site } = useSite()
    const { services = [] } = useServices()
    const { pages = [] } = usePages()
    const { theme, setTheme } = useTheme()

    // Resources Data (Insights & Case Studies)
    const resourcesData = [
        {
            id: 'insights',
            title: 'Insights',
            description: 'Latest trends, thoughts, and industry updates.',
            url: '/insights',
            icon: Newspaper
        },
        {
            id: 'case-studies',
            title: 'Case Studies',
            description: 'Real-world examples of our success stories.',
            url: '/case-studies',
            icon: Briefcase
        },
    ]

    // New Nav Structure
    const items = [
        { id: 'about', label: 'About', url: '/about' },
        { id: 'capabilities', label: 'Capabilities', url: '/#capabilities', type: 'dropdown', data: services },
        { id: 'how-we-work', label: 'How We Work', url: '/#how-we-work' },
        { id: 'resources', label: 'Resources', url: '/resources', type: 'dropdown', data: [] },
        { id: 'contact', label: 'Contact', url: '/contact' },
        ...pages.filter(p => p.show_in_menu).map(p => ({ id: p.id, label: p.title, url: `/${p.slug}` }))
    ]



    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50)
        }
        handleScroll() // Check initial scroll position
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [open])

    const toggleTheme = () => {
    }

    // Text Slide Up Animation for Button
    const buttonTextVariants = {
        initial: { y: 0 },
        hover: { y: -30 },
    }

    const secondTextVariants = {
        initial: { y: 30 },
        hover: { y: 0 },
    }

    const getServiceIcon = (title = '') => {
        const t = title.toLowerCase()
        if (t.includes('web')) return Globe
        if (t.includes('app') || t.includes('mobile')) return Smartphone
        if (t.includes('ai') || t.includes('learning') || t.includes('automation')) return Cpu
        if (t.includes('design') || t.includes('ux') || t.includes('interface')) return Layout
        if (t.includes('cloud') || t.includes('devops') || t.includes('infrastructure')) return Cloud
        if (t.includes('data') || t.includes('analytics') || t.includes('insight')) return Database
        if (t.includes('security') || t.includes('privacy') || t.includes('assurance')) return Shield
        if (t.includes('strategy') || t.includes('consult') || t.includes('digital')) return BarChart3
        if (t.includes('product') || t.includes('engineer')) return Zap
        if (t.includes('enterprise') || t.includes('platform')) return Layers
        return Code2 // Default
    }

    const getMenuIcon = (id) => {
        switch (id) {
            case 'about': return Newspaper
            case 'capabilities': return Layers
            case 'how-we-work': return Settings
            case 'resources': return Briefcase
            case 'contact': return MessageSquare // Need to import this
            default: return Code2
        }
    }

    return (
        <m.header
            className={cx(
                "fixed top-0 left-0 right-0 z-[20051] transition-all duration-300",
                isSticky
                    ? "bg-[#01010e] border-b border-white/5 h-[90px]"
                    : "bg-transparent h-[90px]"
            )}
        >
            <div className={cx(
                "w-full h-full flex items-center justify-between transition-all duration-300 relative",
                "px-6 md:px-[60px]"
            )}>
                {/* A. Logo (Left) */}
                <Link href="/" className="flex items-center gap-3 group relative z-50">
                    <div className="transition-all duration-300 relative h-[50px] w-auto">
                        <Image
                            src="/images/digitfellas_logo.png"
                            alt="DigitFellas Logo"
                            width={220}
                            height={60}
                            priority
                            className="object-contain h-full w-auto"
                        />
                    </div>
                </Link>

                {/* B. Main Navigation (Center-ish / Right-ish) */}
                <nav className="hidden lg:flex items-center gap-[30px] h-full">
                    {items.map((item) => (
                        <div key={item.id} className="group h-full flex items-center"
                            onMouseEnter={() => item.type === 'dropdown' && setFocusedItem(item.id)}
                            onMouseLeave={() => setFocusedItem(null)}
                        >
                            <Link
                                href={item.url}
                                className={cx(
                                    "text-sm font transition-colors relative py-4 flex items-center gap-2",
                                    "text-[#83868a] hover:text-[#331676] dark:text-foreground/80 dark:hover:text-primary" // Corporate Gray default
                                )}
                            >
                                {item.label}
                                {item.type === 'dropdown' && <ChevronDown className="w-3 h-3 text-[#83868a] dark:text-foreground transition-transform group-hover:rotate-180" />}
                            </Link>

                            {/* Mega Menu Dropdown */}
                            {item.type === 'dropdown' && (
                                <AnimatePresence>
                                    {focusedItem === item.id && (
                                        <m.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="fixed left-0 right-0 top-[80px] md:top-[90px] w-full z-50 border-t border-border"
                                        >
                                            <div className="bg-[#01010e]/95 backdrop-blur-xl border-b border-border shadow-2xl py-12 w-full">
                                                <div className="container mx-auto max-w-7xl px-6 md:px-12">
                                                    <div className="grid grid-cols-4 gap-8">
                                                        {(item.id === 'capabilities' ? services : resourcesData).map((subItem) => {
                                                            const Icon = item.id === 'capabilities' ? getServiceIcon(subItem.title) : (subItem.icon || Code2)

                                                            // Fallback descriptions map
                                                            const descriptions = {
                                                                "Digital Product Engineering": "Web and mobile systems built to scale.",
                                                                "Commerce & Platform Engineering": "Scalable commerce and enterprise platforms.",
                                                                "AI & Automation Engineering": "Intelligent automation for real business workflows.",
                                                                "Security & Assurance": "Software security, audits, and risk assurance."
                                                            }
                                                            const displayDesc = subItem.short_description || descriptions[subItem.title] || subItem.description || 'Professional digital services'

                                                            return (
                                                                <Link
                                                                    key={subItem.id}
                                                                    href={item.id === 'capabilities' ? `/capabilities/${subItem.slug}` : subItem.url}
                                                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#331676] dark:hover:bg-[#331676]/50 transition-all group/item border border-transparent hover:border-border/50"
                                                                >
                                                                    <div className="w-10 h-10 rounded-lg bg-[#0c053e] flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform shadow-sm">
                                                                        <Icon className="w-5 h-5 text-[#1a73e8] dark:text-foreground dark:group-hover/item:text-foreground" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-base font-bold text-foreground mb-1 group-hover/item:text-white dark:group-hover/item:text-white transition-colors">
                                                                            {subItem.title || subItem.label}
                                                                        </h4>
                                                                        <p className="text-xs text-muted-foreground leading-relaxed group-hover/item:text-white/80 dark:group-hover/item:text-white/80 transition-colors">
                                                                            {displayDesc}
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </m.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </nav>

                {/* C. CTA Button (Right) */}
                <div className="hidden lg:flex items-center gap-6">


                    <Link href="/contact">
                        <m.div
                            className="relative overflow-hidden border-2 border-[#83868a] text-foreground hover:text-white hover:bg-[#331676] transition-colors rounded-full px-[35px] py-[12px] font-bold text-sm uppercase tracking-wide cursor-pointer h-[52px] flex items-center justify-center min-w-[260px]"
                            initial="initial"
                            whileHover="hover"
                        >
                            <div className="relative h-[20px] overflow-hidden flex flex-col items-center justify-center w-full">
                                <m.span variants={buttonTextVariants} className="absolute inset-0 flex items-center justify-center whitespace-nowrap h-full">
                                    Start a conversation
                                </m.span>
                                <m.span variants={secondTextVariants} className="absolute inset-0 flex items-center justify-center whitespace-nowrap h-full">
                                    Start a conversation
                                </m.span>
                            </div>
                        </m.div>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center gap-4">

                    <Button variant="ghost" size="icon" className="text-[#83868a] dark:text-foreground hover:bg-accent" onClick={() => setOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div >

            {/* Mobile Nav Overlay - FULL SCREEN (Portalled to body) */}
            {mounted && typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {open && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-0 left-0 right-0 bottom-0 z-[99999] bg-[#01010e] flex flex-col lg:hidden"
                        >
                            {/* Header within Mobile Menu */}
                            <div className="flex items-center justify-between px-6 md:px-[60px] h-[80px] md:h-[90px] border-b border-border">
                                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                                    <div className="relative h-[50px] w-auto">
                                        <Image
                                            src="/images/digitfellas_logo.png"
                                            alt="DigitFellas Logo"
                                            width={220}
                                            height={60}
                                            priority
                                            className="object-contain h-full w-auto"
                                        />
                                    </div>
                                </Link>
                                <Button variant="ghost" size="icon" className="text-[#83868a] dark:text-foreground -mr-2" onClick={() => setOpen(false)}>
                                    <X className="w-8 h-8" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-8 px-[30px] flex flex-col gap-8">
                                {items.map((item) => (
                                    <div key={item.id} className="border-b border-border/50 pb-6 last:border-0">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-4 flex-1">
                                                <Link
                                                    href={item.url}
                                                    className="text-3xl font-bold text-[#83868a] hover:text-[#331676] dark:text-foreground dark:hover:text-primary transition-colors flex-1"
                                                    onClick={(e) => {
                                                        if (item.type === 'dropdown') {
                                                            e.preventDefault();
                                                            setFocusedItem(focusedItem === item.id ? null : item.id);
                                                        } else {
                                                            setOpen(false);
                                                        }
                                                    }}
                                                >
                                                    {item.label}
                                                </Link>
                                            </div>
                                            {item.type === 'dropdown' && (
                                                <ChevronDown
                                                    className={cx(
                                                        "w-6 h-6 text-[#83868a] dark:text-muted-foreground transition-transform duration-300 cursor-pointer",
                                                        focusedItem === item.id ? "rotate-180" : ""
                                                    )}
                                                    onClick={() => setFocusedItem(focusedItem === item.id ? null : item.id)}
                                                />
                                            )}
                                        </div>

                                        {/* Mobile Submenu - Indented & Collapsible */}
                                        <AnimatePresence>
                                            {item.type === 'dropdown' && focusedItem === item.id && (
                                                <m.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-4 pt-4 flex flex-col gap-4 border-l-2 border-primary/20 mt-2">
                                                        {(item.id === 'capabilities' ? services : resourcesData).map(s => (
                                                            <Link
                                                                key={s.id}
                                                                href={item.id === 'capabilities' ? `/capabilities/${s.slug}` : s.url}
                                                                onClick={() => setOpen(false)}
                                                                className="flex items-center gap-3 group/mob-item"
                                                            >
                                                                {(() => {
                                                                    const Icon = item.id === 'capabilities' ? getServiceIcon(s.title) : (s.icon || Code2)
                                                                    return <Icon className="w-5 h-5 text-[#83868a] group-hover/mob-item:text-[#1a73e8] transition-colors" />
                                                                })()}
                                                                <span className="text-lg text-muted-foreground group-hover/mob-item:text-[#331676] dark:group-hover/mob-item:text-white transition-colors">
                                                                    {s.title || s.label}
                                                                </span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </m.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            <div className="p-[30px] border-t border-border">
                                <Link href="/contact" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-14 rounded-full border-2 border-[#83868a] bg-transparent text-foreground text-lg font-bold hover:bg-[#331676] hover:text-white transition-all">
                                        Start a conversation
                                    </Button>
                                </Link>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </m.header >
    )

}
