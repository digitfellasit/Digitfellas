'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Save, RefreshCw, LogOut, FileText, Briefcase, FolderOpen, Sparkles, Eye, TrendingUp, Users, Layout } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

async function apiJson(url, opts) {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.error || `Request failed: ${res.status}`)
  return json
}

export default function AdminPage() {
  const [me, setMe] = useState(null)
  const [stats, setStats] = useState({ services: 0, projects: 0, blog: 0, pages: 0 })
  const [recentBlog, setRecentBlog] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const safeFetch = async (url) => {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) {
        console.warn(`API warning: ${url} returned ${res.status}`)
        return []
      }
      return await res.json()
    } catch (err) {
      console.error(`API error fetching ${url}:`, err)
      return []
    }
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' })
      if (!meRes.ok) {
        setMe(null)
        return
      }
      const meJson = await meRes.json().catch(() => ({}))
      setMe(meJson?.user || null)

      if (meJson?.user) {
        // Load stats safely
        const [services, projects, blog, pages] = await Promise.all([
          safeFetch('/api/services'),
          safeFetch('/api/projects'),
          safeFetch('/api/blog'),
          safeFetch('/api/pages'),
        ])

        setStats({
          services: Array.isArray(services) ? services.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          blog: Array.isArray(blog) ? blog.length : 0,
          pages: Array.isArray(pages) ? pages.length : 0,
        })

        setRecentBlog(Array.isArray(blog) ? blog.slice(0, 5) : [])
      }
    } catch (err) {
      console.error('Refresh error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const login = async () => {

    try {
      const json = await apiJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setMe(json?.user || null)
      await refresh()
    } catch (e) {
    }
  }

  const logout = async () => {
    await apiJson('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) })
    setMe(null)
  }

  if (loading) {
    return (
      <div className="container py-14">
        <div className="h-9 w-48 rounded bg-muted animate-pulse" />
        <div className="mt-4 h-5 w-72 rounded bg-muted animate-pulse" />
      </div>
    )
  }

  if (!me?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <div className="space-y-4">
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && login()}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <Button onClick={login} className="w-full">
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {me?.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Services</p>
              <p className="text-3xl font-bold mt-2">{stats.services}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <Link href="/admin/services" className="text-sm text-primary hover:underline mt-4 inline-block">
            Manage Services →
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Projects</p>
              <p className="text-3xl font-bold mt-2">{stats.projects}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <Link href="/admin/projects" className="text-sm text-primary hover:underline mt-4 inline-block">
            Manage Projects →
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
              <p className="text-3xl font-bold mt-2">{stats.blog}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <Link href="/admin/blog" className="text-sm text-primary hover:underline mt-4 inline-block">
            Manage Blog →
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">CMS Pages</p>
              <p className="text-3xl font-bold mt-2">{stats.pages}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <Link href="/admin/pages" className="text-sm text-primary hover:underline mt-4 inline-block">
            Manage Pages →
          </Link>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Blog Posts</h2>
          {recentBlog.length === 0 ? (
            <p className="text-muted-foreground text-sm">No blog posts yet</p>
          ) : (
            <div className="space-y-4">
              {recentBlog.map((post) => (
                <div key={post.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <Link href={`/admin/blog`} className="font-medium hover:text-primary">
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'No date'}</span>
                      {post.view_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/services">
                <Briefcase className="h-4 w-4 mr-2" />
                Add New Service
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/projects">
                <FolderOpen className="h-4 w-4 mr-2" />
                Add New Project
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/blog">
                <FileText className="h-4 w-4 mr-2" />
                Write Blog Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/client-logos">
                <Users className="h-4 w-4 mr-2" />
                Add Brand Logo
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/pages">
                <Sparkles className="h-4 w-4 mr-2" />
                Create CMS Page
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/media">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upload Media
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/navigation">
                <Layout className="h-4 w-4 mr-2" />
                Manage Navigation
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}