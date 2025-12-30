'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { renderMarkdown } from '@/lib/render-markdown'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Page() {
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/site', { cache: 'no-store' })
      const json = await res.json()
      setSite(json)
      setLoading(false)
    }
    run()
  }, [])

  if (loading) {
    return (
      <div className="container py-16">
        <div className="h-10 w-52 rounded bg-muted" />
        <div className="mt-6 h-6 w-2/3 rounded bg-muted" />
      </div>
    )
  }

  const about = site?.pages?.about

  return (
    <div className="container py-14 md:py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-primary">About</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{about?.title || 'About'}</h1>
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

      <div className="mt-8 text-sm text-muted-foreground">
        Edit this page from <Link className="underline" href="/admin">Admin</Link>.
      </div>
    </div>
  )
}
