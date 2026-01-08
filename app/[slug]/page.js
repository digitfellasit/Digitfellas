import { notFound } from 'next/navigation'
import { renderMarkdown } from '@/lib/render-markdown'
import { getPool } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Force dynamic since we query DB directly
export const dynamic = 'force-dynamic'

async function getPageData(slug) {
    if (!process.env.DATABASE_URL) return null
    const pool = getPool()
    try {
        const res = await pool.query(
            'SELECT * FROM cms_pages WHERE slug = $1 AND is_published = true AND deleted_at IS NULL',
            [slug]
        )
        return res.rows[0] || null
    } catch (e) {
        console.error(`Failed to fetch CMS page data for slug: ${slug}`, e)
        return null
    }
}

export default async function CMSPage({ params }) {
    const { slug } = params
    const page = await getPageData(slug)

    if (!page) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-[#01010e] text-white">
            <div className="container py-24 md:py-32">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                            {page.title}
                        </h1>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                    </header>

                    <Card className="rounded-2xl border-white/10 bg-[#0c053e]/40 backdrop-blur-sm p-8 md:p-12 shadow-2xl">
                        <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300">
                            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
