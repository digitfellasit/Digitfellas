import './globals.css'
import './scroll-animations.css'
import { Inter, Manrope } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/components/query-provider'
import { SiteHeader } from '@/components/SiteHeader'
import { Toaster } from '@/components/ui/sonner'
import { getPool } from '@/lib/db'

async function getSiteData() {
    if (!process.env.DATABASE_URL) return {}
    try {
        const pool = getPool()
        const res = await pool.query('SELECT data FROM df_site ORDER BY updated_at DESC LIMIT 1')
        return res?.rows?.[0]?.data || {}
    } catch (e) {
        console.error("Failed to fetch site data for layout", e)
        return {}
    }
}

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-inter',
})

const manrope = Manrope({
    weight: ['400', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-manrope',
})

export const metadata = {
    title: 'Digitfellas IT Solutions LLP',
    description: 'Digitfellas — Professional IT Solutions, Products, and Digital Experiences',
    icons: {
        icon: '/images/favico.png',
    },
}

import { SiteFooter } from '@/components/SiteFooter'

export default async function RootLayout({ children }) {
    const site = await getSiteData()
    const analyticsId = site?.analytics_id
    const headScripts = site?.head_scripts

    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
            <head>
                {analyticsId && (
                    <>
                        <script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${analyticsId}');
                `,
                            }}
                        />
                    </>
                )}
                {headScripts && (
                    headScripts.trim().startsWith('<') ? (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `</script>${headScripts}<script>`,
                            }}
                        />
                    ) : (
                        <script
                            type={headScripts.trim().startsWith('{') || headScripts.trim().startsWith('[') ? "application/ld+json" : "text/javascript"}
                            dangerouslySetInnerHTML={{
                                __html: headScripts,
                            }}
                        />
                    )
                )}
            </head>
            <body className="min-h-screen bg-background font-sans text-foreground antialiased">
                <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange={false}>
                    <QueryProvider>
                        <SiteHeader />
                        {children}
                        <SiteFooter />
                        <Toaster />
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}