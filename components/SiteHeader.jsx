'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Code2, Sun, Moon, ChevronDown, ChevronRight } from 'lucide-react'
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
    const [scrollY, setScrollY] = useState(0)
    const [visible, setVisible] = useState(true)
    const [servicesOpen, setServicesOpen] = useState(false)
    const pathname = usePathname()

    // Hide global nav on admin pages
    if (pathname?.startsWith('/admin')) return null

    const { navigation } = useNavigation()
    const { site } = useSite()
    const { services = [] } = useServices()
    const { theme, setTheme } = useTheme()


    const items = navigation || []

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        let lastScrollY = window.scrollY
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setVisible(true)
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setVisible(false)
            }
            lastScrollY = currentScrollY
            setScrollY(currentScrollY)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    // Find Services link to attach dropdown
    const renderNavItem = (it, idx) => {
        const isServices = it.label.toLowerCase() === 'services'

        if (isServices) {
            return (
                <div key={it.id} className="relative group" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                    <Link
                        href={it.url || '/services'}
                        className="text-sm font-bold transition-all relative pb-1 text-gray-400 hover:text-white flex items-center gap-1"
                        onClick={() => setServicesOpen(false)}
                    >
                        {it.label}
                        <ChevronDown className="h-3 w-3" />
                    </Link>

                    <AnimatePresence>
                        {servicesOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute left-0 mt-2 w-64 rounded-xl bg-background border border-border/50 shadow-xl overflow-hidden z-50 p-2"
                            >
                                <div className="flex flex-col gap-1">
                                    {services.length > 0 ? services.map(service => (
                                        <Link
                                            key={service.id}
                                            href={`/services/${service.slug}`}
                                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors block text-foreground"
                                        >
                                            {service.title}
                                        </Link>
                                    )) : (
                                        <div className="px-4 py-2 text-sm text-muted-foreground">No services found</div>
                                    )}
                                    <div className="h-px bg-border my-1" />
                                    <Link href="/services" className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary flex items-center justify-between">
                                        View All <ChevronRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )
        }

        return (
            <Link
                key={it.id}
                href={it.url || '#'}
                className={cx(
                    "text-sm font-bold transition-all relative pb-1",
                    idx === 0 ? "text-white" : "text-gray-400 hover:text-white"
                )}
            >
                {it.label}
                {idx === 0 && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </Link>
        )
    }

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: visible ? 0 : -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        >
            <div className="container flex h-20 items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white backdrop-blur shadow-lg border border-white/20"
                        >
                            <Code2 className="h-5 w-5" />
                        </motion.div>
                        <div className="leading-tight">
                            <div className="text-xl font-bold tracking-tight text-white">{site?.brand?.name || 'Digit Fellas'}</div>
                        </div>
                    </Link>

                    {/* Desktop Nav Items - Grouped with Brand */}
                    <div className="hidden items-center gap-8 md:flex">
                        {items.map((it, idx) => renderNavItem(it, idx))}
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="hidden items-center gap-6 md:flex">
                    {mounted && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                            aria-label="Toggle theme"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={theme}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="h-4 w-4 text-yellow-400" />
                                    ) : (
                                        <Moon className="h-4 w-4 text-blue-400" />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                    )}
                    <Button asChild className="rounded-full px-8 py-5 bg-white/10 text-white hover:bg-white hover:text-black transition-all font-bold text-sm border border-white/20 backdrop-blur-md shadow-xl">
                        <Link href="/contact">
                            Get in touch!
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" className="rounded-full text-white" onClick={() => setOpen(true)}>
                        <Menu className="h-6 w-6" />
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
                            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-50 w-[280px] bg-background border-l border-border shadow-2xl md:hidden"
                        >
                            <div className="flex flex-col h-full p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="text-sm font-bold tracking-tight">Menu</div>
                                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setOpen(false)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-5">
                                    {items.map((it) => (
                                        <div key={it.id}>
                                            <Link
                                                href={it.url || '#'}
                                                onClick={() => setOpen(false)}
                                                className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors block mb-2"
                                            >
                                                {it.label}
                                            </Link>
                                            {it.label.toLowerCase() === 'services' && services.length > 0 && (
                                                <div className="pl-4 border-l border-border flex flex-col gap-2 mt-1">
                                                    {services.map(s => (
                                                        <Link
                                                            key={s.id}
                                                            href={`/services/${s.slug}`}
                                                            onClick={() => setOpen(false)}
                                                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                                        >
                                                            {s.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto flex flex-col gap-3">
                                    {mounted && (
                                        <Button
                                            onClick={toggleTheme}
                                            variant="outline"
                                            className="w-full rounded-full py-6 flex items-center justify-center gap-2"
                                        >
                                            {theme === 'dark' ? (
                                                <>
                                                    <Sun className="h-5 w-5 text-yellow-500" />
                                                    <span>Light Mode</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Moon className="h-5 w-5 text-blue-600" />
                                                    <span>Dark Mode</span>
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
