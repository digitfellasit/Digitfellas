'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ChevronRight, Code2, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useNavigation, useSite, useServices } from '@/lib/api-hooks'

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
    const { theme, setTheme } = useTheme()

    // New Nav Structure
    const items = [
        { id: 'about', label: 'About', url: '/about' },
        { id: 'capabilities', label: 'Capabilities', url: '/services', type: 'dropdown', data: services },
        { id: 'how-we-work', label: 'How We Work', url: '/how-we-work' },
        { id: 'resources', label: 'Resources', url: '/resources', type: 'dropdown', data: [] },
        { id: 'contact', label: 'Contact', url: '/contact' },
    ]

    // Resources Data (Insights & Case Studies)
    const resourcesData = [
        {
            id: 'insights',
            title: 'Insights',
            description: 'Latest trends, thoughts, and industry updates.',
            url: '/blog',
            icon: '/icons/insights.svg'
        },
        {
            id: 'case-studies',
            title: 'Case Studies',
            description: 'Real-world examples of our success stories.',
            url: '/projects',
            icon: '/icons/casestudies.svg'
        },
    ]

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
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

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cx(
                "fixed top-0 left-0 right-0 z-[20051] transition-all duration-300",
                isSticky
                    ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/10 h-[80px] md:h-[90px]"
                    : "bg-transparent h-[80px] md:h-[90px]"
            )}
        >
            <div className={cx(
                "w-full h-full flex items-center justify-between transition-all duration-300 relative",
                "px-[30px] md:px-[60px]"
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
                            className="object-contain h-full w-auto dark:invert-0 invert"
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
                                    "text-sm font-bold transition-colors relative py-4 flex items-center gap-1",
                                    "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {item.label}
                                {item.type === 'dropdown' && <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />}
                            </Link>

                            {/* Mega Menu Dropdown */}
                            {item.type === 'dropdown' && (
                                <AnimatePresence>
                                    {focusedItem === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="fixed left-0 right-0 top-[80px] md:top-[90px] w-full z-50 border-t border-border"
                                        >
                                            <div className="bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl py-12 w-full">
                                                <div className="container mx-auto max-w-7xl px-6 md:px-12">
                                                    <div className="grid grid-cols-4 gap-8">
                                                        {(item.id === 'capabilities' ? services : resourcesData).map((subItem) => (
                                                            <Link
                                                                key={subItem.id}
                                                                href={item.id === 'capabilities' ? `/services/${subItem.slug}` : subItem.url}
                                                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/50 transition-all group/item border border-transparent hover:border-border/50"
                                                            >
                                                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform shadow-sm">
                                                                    <Code2 className="w-5 h-5 text-foreground" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-base font-bold text-foreground mb-1 group-hover/item:text-primary transition-colors">
                                                                        {subItem.title || subItem.label}
                                                                    </h4>
                                                                    <p className="text-xs text-muted-foreground leading-relaxed group-hover/item:text-foreground/80 transition-colors">
                                                                        {item.id === 'capabilities' ? subItem.short_description || 'Professional digital services' : subItem.description}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </nav>

                {/* C. CTA Button (Right) */}
                <div className="hidden lg:flex items-center gap-6">
                    {mounted && (
                        <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent">
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}

                    <Link href="/contact">
                        <motion.div
                            className="relative overflow-hidden border-2 border-foreground text-foreground hover:text-background hover:bg-foreground transition-colors rounded-full px-[35px] py-[12px] font-bold text-sm uppercase tracking-wide cursor-pointer h-[52px] flex items-center justify-center min-w-[260px]"
                            initial="initial"
                            whileHover="hover"
                        >
                            <div className="relative h-[20px] overflow-hidden flex flex-col items-center justify-center w-full">
                                <motion.span variants={buttonTextVariants} className="absolute inset-0 flex items-center justify-center whitespace-nowrap h-full">
                                    Start a conversation
                                </motion.span>
                                <motion.span variants={secondTextVariants} className="absolute inset-0 flex items-center justify-center whitespace-nowrap h-full">
                                    Start a conversation
                                </motion.span>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center gap-4">
                    {mounted && (
                        <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors">
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent" onClick={() => setOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div >

            {/* Mobile Nav Overlay */}
            < AnimatePresence >
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-[20052] bg-background/80 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-[20053] w-[300px] bg-background border-l border-border shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-border h-[80px]">
                                <span className="text-lg font-bold text-foreground">Menu</span>
                                <Button variant="ghost" size="icon" className="text-foreground" onClick={() => setOpen(false)}>
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
                                {items.map((item) => (
                                    <div key={item.id}>
                                        <Link
                                            href={item.url}
                                            onClick={() => setOpen(false)}
                                            className="text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors block"
                                        >
                                            {item.label}
                                        </Link>
                                        {/* Mobile Submenu for Dropdowns */}
                                        {item.type === 'dropdown' && (
                                            <div className="pl-4 mt-4 flex flex-col gap-3 border-l-2 border-border">
                                                {(item.id === 'capabilities' ? services : resourcesData).map(s => (
                                                    <Link
                                                        key={s.id}
                                                        href={item.id === 'capabilities' ? `/services/${s.slug}` : s.url}
                                                        onClick={() => setOpen(false)}
                                                        className="text-base text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {item.id === 'capabilities' ? s.title : s.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-border">
                                <Link href="/contact" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-12 rounded-full bg-foreground text-background font-bold hover:opacity-90">
                                        Start a conversation
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )
                }
            </AnimatePresence >
        </motion.header >
    )

}
