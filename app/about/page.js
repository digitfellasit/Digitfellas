import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { renderMarkdown } from '@/lib/render-markdown'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getPool } from '@/lib/db'

async function getAboutData() {
  if (!process.env.DATABASE_URL) return {}
  const pool = getPool()
  try {
    const res = await pool.query('SELECT data FROM df_site ORDER BY updated_at DESC LIMIT 1')
    return res?.rows?.[0]?.data?.pages?.about || {}
  } catch (e) {
    console.error("Failed to fetch about data", e)
    return {}
  }
}

export const dynamic = 'force-dynamic'

export default async function Page() {
  const about = await getAboutData()

  return (
    <div className="min-h-screen bg-[#01010e]">
      <div className="container py-24 md:py-28">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="mt-3 text-3xl font-semibold text-center tracking-tight md:text-4xl">{about?.title || 'About'}</h1>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/contact">
              Contact <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Separator className="my-8" />

        <Card className="rounded-2xl border-border p-6 md:p-8">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(about?.content) }} />
          </div>
        </Card>
      </div>
    </div>
  )
}
