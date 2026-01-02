'use client'

import Link from 'next/link'
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
    const [servicesOpen, setServicesOpen] = useState(false)
    const pathname = usePathname()

    // Hide global nav on admin pages
    if (pathname?.startsWith('/admin')) return null

    const { navigation } = useNavigation()
    const { site } = useSite()
    const { services = [] } = useServices()
    const { theme, setTheme } = useTheme()

    const items = [
        { id: 'home', label: 'Home', url: '/' },
        { id: 'about', label: 'About', url: '/about' },
        { id: 'projects', label: 'Projects', url: '/projects' },
        { id: 'services', label: 'Services', url: '/services' },
        { id: 'blog', label: 'Blog', url: '/blog' },
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
        hover: { y: -25 }, // Adjust based on height
    }

    const secondTextVariants = {
        initial: { y: 25 },
        hover: { y: 0 },
    }

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cx(
                "fixed top-0 left-0 right-0 z-[20051] transition-all duration-300 ease-in-out",
                isSticky
                    ? "bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg h-[70px] md:h-[70px]"
                    : "bg-transparent h-[80px] md:h-auto py-6"
            )}
        >
            <div className={cx(
                "w-full h-full flex items-center justify-between transition-all duration-300",
                "px-[30px] md:px-[60px]" // Desktop 60px, Tablet/Mobile 30px
            )}>
                {/* A. Logo (Left) */}
                <Link href="/" className="flex items-center gap-3 group relative z-50">
                    <div className={cx(
                        "transition-all duration-300 bg-white/10 rounded-lg flex items-center justify-center text-white backdrop-blur-sm border border-white/20",
                        isSticky ? "w-10 h-10" : "w-12 h-12"
                    )}>
                        {/* Placeholder for SVG Favicon */}
                        <Code2 className={isSticky ? "w-6 h-6" : "w-7 h-7"} />
                    </div>
                    <div className={cx("transition-all duration-300 origin-left", isSticky ? "scale-90" : "scale-100")}>
                        {/* Placeholder for Full Logo Image */}
                        <span className="text-xl md:text-2xl font-bold tracking-tight text-white font-heading">
                            {site?.brand?.name || 'Digit Fellas'}
                        </span>
                    </div>
                </Link>

                {/* B. Main Navigation (Center-ish / Right-ish) */}
                <nav className="hidden lg:flex items-center gap-[40px]">
                    {items.map((item) => (
                        <div key={item.id} className="relative group">
                            {item.label === 'Services' ? (
                                <div onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)} className="relative h-full flex items-center">
                                    <button className="text-sm font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1 py-4">
                                        {item.label} <ChevronDown className="w-3 h-3" />
                                    </button>
                                    {/* Center-grow underline */}
                                    <span className="absolute bottom-3 left-1/2 w-0 h-[2px] bg-[#ffffff] transition-all duration-300 group-hover:w-full group-hover:left-0" />

                                    {/* Dropdown */}
                                    <AnimatePresence>
                                        {servicesOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64"
                                            >
                                                <div className="bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-2">
                                                    {services.slice(0, 5).map(service => (
                                                        <Link
                                                            key={service.id}
                                                            href={`/services/${service.slug}`}
                                                            className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            {service.title}
                                                        </Link>
                                                    ))}
                                                    <div className="h-px bg-white/10 my-1" />
                                                    <Link href="/services" className="flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#ffffff] hover:bg-white/5 rounded-lg">
                                                        View All <ChevronRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    href={item.url}
                                    className="text-sm font-bold text-gray-300 hover:text-white transition-colors relative py-4 block"
                                >
                                    {item.label}
                                    {/* Center-grow underline */}
                                    {pathname === item.url ? (
                                        <span className="absolute bottom-3 left-0 w-full h-[2px] bg-[#ffffff]" />
                                    ) : (
                                        <span className="absolute bottom-3 left-1/2 w-0 h-[2px] bg-[#ffffff] transition-all duration-300 group-hover:w-full group-hover:left-0" />
                                    )}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* C. CTA Button (Right) */}
                <div className="hidden lg:flex items-center gap-6">
                    {mounted && (
                        <button onClick={toggleTheme} className="text-gray-400 hover:text-white transition-colors">
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}

                    <Link href="/contact">
                        <motion.div
                            className="relative overflow-hidden border-2 border-[#ffffff] text-[#ffffff] hover:text-black hover:bg-[#ffffff] transition-colors rounded-full px-[25px] py-[12px] font-bold text-sm uppercase tracking-wide cursor-pointer h-[48px] flex items-center justify-center min-w-[160px]"
                            initial="initial"

                        >
                            <div className="relative  h-6  flex flex-col items-center">
                                <motion.span variants={buttonTextVariants} className="absolute inset-2 flex items-center justify-center">
                                    Get in touch!
                                </motion.span>

                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-[20052] bg-black/80 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-[20053] w-[300px] bg-[#121212] border-l border-white/10 shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-white/10 h-[80px]">
                                <span className="text-lg font-bold text-white">Menu</span>
                                <Button variant="ghost" size="icon" className="text-white" onClick={() => setOpen(false)}>
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
                                {items.map((item) => (
                                    <div key={item.id}>
                                        <Link
                                            href={item.url}
                                            onClick={() => setOpen(false)}
                                            className="text-2xl font-bold text-gray-400 hover:text-white transition-colors block"
                                        >
                                            {item.label}
                                        </Link>
                                        {item.label === 'Services' && (
                                            <div className="pl-4 mt-4 flex flex-col gap-3 border-l-2 border-white/10">
                                                {services.map(s => (
                                                    <Link
                                                        key={s.id}
                                                        href={`/services/${s.slug}`}
                                                        onClick={() => setOpen(false)}
                                                        className="text-base text-gray-500 hover:text-[#ffffff] transition-colors"
                                                    >
                                                        {s.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-white/10">
                                <Link href="/contact" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-12 rounded-full bg-[#ffffff] text-black font-bold hover:bg-[#CA9A04]">
                                        Get in touch!
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
