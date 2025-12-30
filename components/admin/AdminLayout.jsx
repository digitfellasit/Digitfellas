'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Settings,
    Menu as MenuIcon,
    Navigation,
    Sparkles,
    Briefcase,
    FolderOpen,
    FileText,
    Image as ImageIcon,
    Users,
    X,
    Sun,
    Moon,
    UserCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/site-settings', label: 'Site Settings', icon: Settings },
    { href: '/admin/hero', label: 'Hero Section', icon: Sparkles },
    { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
    { href: '/admin/services', label: 'Services', icon: Briefcase },
    { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
    { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
    { href: '/admin/pages', label: 'CMS Pages', icon: FileText },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { href: '/admin/profile', label: 'Profile Settings', icon: UserCircle },
]

export function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])


    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 flex items-center justify-between px-4">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                        className="mr-4"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </Button>
                    <h1 className="text-lg font-bold">Admin</h1>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
                </Button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 z-50 w-64 bg-card border-r border-border transition-transform lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                        <h2 className="text-lg font-bold">Admin Panel</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-border">
                        <Link href="/" className="block">
                            <Button variant="outline" className="w-full">
                                View Site
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                {/* Desktop Top Bar */}
                <div className="hidden lg:flex h-16 items-center justify-between px-8 border-b border-border bg-card">
                    <h1 className="text-lg font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {mounted && (theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-500" />)}
                        </Button>
                        <Link href="/admin/profile">
                            <Button variant="ghost" size="icon">
                                <UserCircle className="h-6 w-6" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
