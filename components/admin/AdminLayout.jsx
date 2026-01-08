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
    UserCircle,
    ChevronLeft,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/site-settings', label: 'Site Settings', icon: Settings },
    { href: '/admin/hero', label: 'Hero Section', icon: Sparkles },
    { href: '/admin/client-logos', label: 'Brand Logos', icon: Users },
    { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
    { href: '/admin/capabilities', label: 'Capabilities', icon: Briefcase },
    { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
    { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
    { href: '/admin/pages', label: 'CMS Pages', icon: FileText },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { href: '/admin/profile', label: 'Profile Settings', icon: UserCircle },
]

export function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
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
                        aria-label="Open sidebar"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </Button>
                    <h1 className="text-lg font-bold">Admin</h1>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle theme"
                >
                    {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
                </Button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 z-50 bg-card border-r border-border transition-all duration-300 transform lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    isCollapsed ? "lg:w-20" : "lg:w-64"
                )}
                aria-label="Sidebar Navigation"
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                        {!isCollapsed && <h2 className="text-lg font-bold">Admin Panel</h2>}
                        {isCollapsed && <div className="mx-auto"><Sparkles className="h-6 w-6 text-primary" aria-hidden="true" /></div>}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-1">
                            <Link
                                href="/admin"
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    pathname === '/admin'
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    isCollapsed && "lg:justify-center lg:px-2"
                                )}
                                title={isCollapsed ? 'Dashboard' : ""}
                                aria-current={pathname === '/admin' ? 'page' : undefined}
                            >
                                <LayoutDashboard className="h-5 w-5 shrink-0" aria-hidden="true" />
                                {!isCollapsed && <span>Dashboard</span>}
                            </Link>

                            {!isCollapsed && (
                                <div className="pt-2 pb-1" role="group" aria-label="Home Page Sections">
                                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1" id="nav-homepage">
                                        Home Page
                                    </h3>
                                    <div className="space-y-1 ml-2 border-l border-border/50 pl-2" aria-labelledby="nav-homepage">
                                        {[
                                            { href: '/admin/hero', label: 'Hero Section' },
                                            { href: '/admin/home/experience', label: 'Experience' },
                                            { href: '/admin/home/how-we-work', label: 'How We Work' },
                                            { href: '/admin/home/partnerships', label: 'Partnerships' },
                                        ].map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                                    pathname === item.href
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                                aria-current={pathname === item.href ? 'page' : undefined}
                                            >
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Management Section / Other Links */}
                            <div className="pt-2" role="group" aria-label="Management">
                                {!isCollapsed && (
                                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1" id="nav-management">
                                        Management
                                    </h3>
                                )}
                                <div aria-labelledby={!isCollapsed ? "nav-management" : undefined}>
                                    {[
                                        { href: '/admin/site-settings', label: 'Site Settings', icon: Settings },
                                        { href: '/admin/capabilities', label: 'Capabilities', icon: Briefcase },
                                        { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
                                        { href: '/admin/case-studies', label: 'Case Studies', icon: Briefcase },
                                        { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
                                        { href: '/admin/pages', label: 'CMS Pages', icon: FileText },
                                        { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
                                        { href: '/admin/client-logos', label: 'Brand Logos', icon: Users },
                                        { href: '/admin/profile', label: 'Profile Settings', icon: UserCircle },
                                    ].map((item) => {
                                        const Icon = item.icon
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                    isCollapsed && "lg:justify-center lg:px-2"
                                                )}
                                                title={isCollapsed ? item.label : ""}
                                                aria-current={isActive ? 'page' : undefined}
                                            >
                                                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                                {!isCollapsed && <span>{item.label}</span>}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-border">
                        <Link href="/" className="block" aria-label="View public site">
                            <Button variant="outline" className={cn("w-full transition-all", isCollapsed && "lg:p-2 lg:h-10")}>
                                {isCollapsed ? <FolderOpen className="h-4 w-4" aria-hidden="true" /> : "View Site"}
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
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={cn(
                "pt-16 lg:pt-0 min-h-screen transition-all duration-300",
                isCollapsed ? "lg:ml-20" : "lg:ml-64"
            )}>
                {/* Desktop Top Bar */}
                <div className="hidden lg:flex h-16 items-center justify-between px-8 border-b border-border bg-card">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? <PanelLeftOpen className="h-5 w-5" aria-hidden="true" /> : <PanelLeftClose className="h-5 w-5" aria-hidden="true" />}
                        </Button>
                        <h1 className="text-lg font-bold">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            aria-label="Toggle theme"
                        >
                            {mounted && (theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" aria-hidden="true" /> : <Moon className="h-5 w-5 text-blue-500" aria-hidden="true" />)}
                        </Button>
                        <Link href="/admin/profile" aria-label="Profile Settings">
                            <Button variant="ghost" size="icon">
                                <UserCircle className="h-6 w-6" aria-hidden="true" />
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
