'use client'

import { useEffect, useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable, StatusBadge } from '@/components/admin/DataTable'
import { RichEditor } from '@/components/admin/RichEditor'
import { MediaGallery } from '@/components/admin/MediaGallery'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

async function apiCall(url, options = {}) {
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } })
    if (!res.ok) throw new Error((await res.json().catch(() => ({ error: 'Request failed' }))).error || `HTTP ${res.status}`)
    return res.json()
}

function generateSlug(title) {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function BlogPage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        title: '', slug: '', excerpt: '', short_description: '', content: '', meta_title: '', meta_description: '',
        is_featured: false, is_published: false, reading_time_minutes: 5,
        featured_image: []
    })

    const loadPosts = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/blog')
            setPosts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load posts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadPosts() }, [])

    const handleCreate = () => {
        setEditing(null)
        setFormData({ title: '', slug: '', excerpt: '', short_description: '', content: '', meta_title: '', meta_description: '', is_featured: false, is_published: false, reading_time_minutes: 5, featured_image: [] })
        setDialogOpen(true)
    }

    const handleEdit = (post) => {
        setEditing(post)
        setFormData({
            title: post.title || '', slug: post.slug || '', excerpt: post.excerpt || '', short_description: post.short_description || '', content: post.content || '',
            meta_title: post.meta_title || '', meta_description: post.meta_description || '',
            is_featured: post.is_featured || false, is_published: post.is_published || false,
            reading_time_minutes: post.reading_time_minutes || 5,
            featured_image: post.featured_image ? [post.featured_image] : []
        })
        setDialogOpen(true)
    }

    const handleDelete = async (post) => {
        if (!confirm(`Delete "${post.title}"?`)) return
        try {
            await apiCall(`/api/blog/${post.id}`, { method: 'DELETE' })
            await loadPosts()
        } catch (error) {
            alert('Failed to delete: ' + error.message)
        }
    }

    const handleSave = async () => {
        try {
            const payload = { ...formData, featured_image_id: formData.featured_image?.[0]?.id || null }
            if (editing) {
                await apiCall(`/api/blog/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) })
            } else {
                await apiCall('/api/blog', { method: 'POST', body: JSON.stringify(payload) })
            }
            setDialogOpen(false)
            await loadPosts()
        } catch (error) {
            alert('Failed to save: ' + error.message)
        }
    }

    const columns = [
        { key: 'title', header: 'Title', sortable: true, render: (row) => (<div><div className="font-medium">{row.title}</div><div className="text-xs text-muted-foreground">/{row.slug}</div></div>) },
        { key: 'excerpt', header: 'Excerpt', render: (row) => <div className="max-w-md truncate text-sm text-muted-foreground">{row.excerpt}</div> },
        { key: 'is_published', header: 'Status', render: (row) => <StatusBadge status={row.is_published ? 'published' : 'draft'} /> },
        { key: 'view_count', header: 'Views', render: (row) => row.view_count || 0 },
        { key: 'published_at', header: 'Published', sortable: true, render: (row) => row.published_at ? new Date(row.published_at).toLocaleDateString() : '-' },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold">Blog Posts</h1><p className="text-muted-foreground mt-1">Manage your blog content</p></div>
                    <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />New Post</Button>
                </div>
                <Card className="p-6">
                    {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
                        <DataTable data={posts} columns={columns} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search posts..." emptyMessage="No blog posts yet" />}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Post' : 'Create Post'}</DialogTitle></DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="grid gap-4">
                            <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: formData.slug || generateSlug(e.target.value) })} /></div>
                            <div><Label>Slug *</Label><Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} /></div>
                            <div><Label>Excerpt</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} placeholder="Brief summary for listings" /></div>
                            <div><Label>Short Description (Listings)</Label><Textarea value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} rows={2} placeholder="Very brief summary for cards" /></div>
                            <RichEditor label="Content *" value={formData.content} onChange={(content) => setFormData({ ...formData, content })} minHeight="400px" />
                            <div><Label>Reading Time (minutes)</Label><Input type="number" value={formData.reading_time_minutes} onChange={(e) => setFormData({ ...formData, reading_time_minutes: parseInt(e.target.value) || 5 })} /></div>

                            <MediaGallery
                                label="Featured Image (List Card)"
                                images={formData.featured_image}
                                onChange={(images) => setFormData({ ...formData, featured_image: images })}
                                maxImages={1}
                            />

                            <div className="border-t pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div><Label>Published</Label><p className="text-sm text-muted-foreground">Make this post visible</p></div>
                                    <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div><Label>Featured</Label><p className="text-sm text-muted-foreground">Highlight this post</p></div>
                                    <Switch checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Post</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
