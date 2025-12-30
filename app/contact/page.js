'use client'

import { useEffect, useState } from 'react'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { renderMarkdown } from '@/lib/render-markdown'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function Page() {
  const [site, setSite] = useState(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/site', { cache: 'no-store' })
      const json = await res.json()
      setSite(json)
    }
    run()
  }, [])

  const contact = site?.pages?.contact

  return (
    <div className="container py-14 md:py-16">
      <div className="text-xs font-medium uppercase tracking-widest text-primary">Contact</div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{contact?.title || 'Contact'}</h1>
      <div className="mt-3 max-w-2xl text-muted-foreground" dangerouslySetInnerHTML={{ __html: renderMarkdown(contact?.subtitle || 'Tell us about your project.') }} />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-border p-6">
          <div className="text-sm font-semibold">Message</div>
          <div className="mt-4 grid gap-3">
            <Input placeholder="Your name" />
            <Input placeholder="Email" />
            <Textarea placeholder="What do you want to build?" rows={6} />
            <Button className="rounded-full" onClick={() => setSent(true)}>
              Send
            </Button>
            {sent ? <div className="text-xs text-muted-foreground">MVP: form send is not wired yet.</div> : null}
          </div>
        </Card>

        <Card className="rounded-2xl border-border p-6">
          <div className="text-sm font-semibold">Contact details</div>
          <div className="mt-4 text-sm text-muted-foreground">
            <div>{site?.footer?.contact?.email}</div>
            <div className="mt-1">{site?.footer?.contact?.phone}</div>
            <div className="mt-1">{site?.footer?.contact?.address}</div>
          </div>
          <div className="mt-6 text-xs text-muted-foreground">
            Edit these fields in Admin → Footer.
          </div>
        </Card>
      </div>
    </div>
  )
}
