import './globals.css'
import './scroll-animations.css'
import { Inter, Manrope } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/components/query-provider'
import { SiteHeader } from '@/components/SiteHeader'

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange={false}>
          <QueryProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
