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
          // Legacy support for plain JSON/JS arrays
          (headScripts.trim().startsWith('{') || headScripts.trim().startsWith('[')) ? (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: headScripts,
              }}
            />
          ) : (
            // Parse HTML tags manually to avoid hydration mismatch
            <HeadHTML content={headScripts} />
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

function HeadHTML({ content }) {
  if (!content) return null;
  const elements = [];
  let key = 0;

  // 1. Scripts
  // Match both <script>...</script> and <script src="..." />
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>|<script([^>]*)\/>/gi;

  const allScripts = [...content.matchAll(scriptRegex)];

  allScripts.forEach((m) => {
    const attributes = m[1] || m[3] || "";
    const innerContent = m[2] || ""; // Content between tags

    const props = { key: `script-${key++}` };

    const typeMatch = attributes.match(/type=["']([^"']+)["']/);
    if (typeMatch) props.type = typeMatch[1];

    const srcMatch = attributes.match(/src=["']([^"']+)["']/);
    if (srcMatch) props.src = srcMatch[1];

    const asyncMatch = attributes.match(/\basync\b/);
    if (asyncMatch) props.async = true;

    const deferMatch = attributes.match(/\bdefer\b/);
    if (deferMatch) props.defer = true;

    // Handle standard ID and Class attributes if present (common in analytics scripts)
    const idMatch = attributes.match(/id=["']([^"']+)["']/);
    if (idMatch) props.id = idMatch[1];

    if (innerContent.trim()) {
      props.dangerouslySetInnerHTML = { __html: innerContent };
    }

    elements.push(<script {...props} />);
  });

  // 2. Metas
  const metaRegex = /<meta([^>]+)(?:\/?)>/gi;
  const allMetas = [...content.matchAll(metaRegex)];

  allMetas.forEach((m) => {
    const attributes = m[1];
    const props = { key: `meta-${key++}` };

    const nameMatch = attributes.match(/name=["']([^"']+)["']/);
    if (nameMatch) props.name = nameMatch[1];

    const contentMatch = attributes.match(/content=["']([^"']+)["']/);
    if (contentMatch) props.content = contentMatch[1];

    const propertyMatch = attributes.match(/property=["']([^"']+)["']/);
    if (propertyMatch) props.property = propertyMatch[1];

    const charSetMatch = attributes.match(/charset=["']([^"']+)["']/);
    if (charSetMatch) props.charSet = charSetMatch[1];

    const httpEquivMatch = attributes.match(/http-equiv=["']([^"']+)["']/);
    if (httpEquivMatch) props.httpEquiv = httpEquivMatch[1];

    elements.push(<meta {...props} />);
  });

  // 3. Links
  const linkRegex = /<link([^>]+)(?:\/?)>/gi;
  const allLinks = [...content.matchAll(linkRegex)];

  allLinks.forEach((m) => {
    const attributes = m[1];
    const props = { key: `link-${key++}` };

    const relMatch = attributes.match(/rel=["']([^"']+)["']/);
    if (relMatch) props.rel = relMatch[1];

    const hrefMatch = attributes.match(/href=["']([^"']+)["']/);
    if (hrefMatch) props.href = hrefMatch[1];

    const sizesMatch = attributes.match(/sizes=["']([^"']+)["']/);
    if (sizesMatch) props.sizes = sizesMatch[1];

    const typeMatch = attributes.match(/type=["']([^"']+)["']/);
    if (typeMatch) props.type = typeMatch[1];

    elements.push(<link {...props} />);
  });

  return <>{elements}</>;
}
