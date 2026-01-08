'use client'

import { useEffect, useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable, StatusBadge } from '@/components/admin/DataTable'
import { RichEditor } from '@/components/admin/RichEditor'
import { MediaGallery } from '@/components/admin/MediaGallery'
import { SeoPreviewEditor } from '@/components/admin/SeoPreviewEditor'
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
        {
            key: 'featured_image', header: 'Image', render: (row) => (
                <div className="relative h-12 w-20 overflow-hidden rounded-md border bg-muted">
                    {row.featured_image?.url ? (
                        <img src={row.featured_image.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground uppercase">No Image</div>
                    )}
                </div>
            )
        },
        { key: 'title', header: 'Title', sortable: true, render: (row) => (<div><div className="font-medium">{row.title}</div><div className="text-xs text-muted-foreground">/{row.slug}</div></div>) },
        { key: 'is_published', header: 'Status', render: (row) => <StatusBadge status={row.is_published ? 'published' : 'draft'} /> },
        { key: 'view_count', header: 'Views', render: (row) => row.view_count || 0 },
        { key: 'published_at', header: 'Published', sortable: true, render: (row) => row.published_at ? new Date(row.published_at).toLocaleDateString() : '-' },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold">Insights</h1><p className="text-muted-foreground mt-1">Manage your insights and articles</p></div>
                    <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />New Insight</Button>
                </div>
                <Card className="p-6">
                    {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
                        <DataTable data={posts} columns={columns} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search insights..." emptyMessage="No insights yet" />}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Insight' : 'Create Insight'}</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <Card className="p-4 space-y-4">
                                    <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: formData.slug || generateSlug(e.target.value) })} placeholder="Enter post title" /></div>
                                    <div><Label>Slug *</Label><Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="post-slug" /></div>
                                </Card>

                                <Card className="p-4">
                                    <RichEditor label="Content" value={formData.content} onChange={(content) => setFormData({ ...formData, content })} minHeight="500px" />
                                </Card>

                                <Card className="p-4 space-y-4">
                                    <h3 className="font-medium border-b pb-2">Summaries</h3>
                                    <div><Label>Excerpt</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} placeholder="Brief summary for listings" /></div>
                                    <div><Label>Short Description (Listings)</Label><Textarea value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} rows={2} placeholder="Very brief summary for cards" /></div>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card className="p-4 space-y-4">
                                    <h3 className="font-medium border-b pb-2">Status & Visibility</h3>
                                    <div className="flex items-center justify-between">
                                        <div><Label>Published</Label><p className="text-[10px] text-muted-foreground uppercase">Visible to everyone</p></div>
                                        <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div><Label>Featured</Label><p className="text-[10px] text-muted-foreground uppercase">Highlight on home</p></div>
                                        <Switch checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                                    </div>
                                    <div className="pt-2">
                                        <Label>Reading Time (min)</Label>
                                        <Input type="number" value={formData.reading_time_minutes} onChange={(e) => setFormData({ ...formData, reading_time_minutes: parseInt(e.target.value) || 5 })} />
                                    </div>
                                </Card>

                                <Card className="p-4 space-y-4">
                                    <h3 className="font-medium border-b pb-2">Featured Image</h3>
                                    <MediaGallery
                                        label=""
                                        images={formData.featured_image}
                                        onChange={(images) => setFormData({ ...formData, featured_image: images })}
                                        maxImages={1}
                                    />
                                </Card>

                                <SeoPreviewEditor
                                    title={formData.title}
                                    slug={formData.slug}
                                    metaTitle={formData.meta_title}
                                    metaDescription={formData.meta_description}
                                    onMetaTitleChange={(value) => setFormData({ ...formData, meta_title: value })}
                                    onMetaDescriptionChange={(value) => setFormData({ ...formData, meta_description: value })}
                                    pathPrefix="/insights"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} className="min-w-[120px]"><Save className="h-4 w-4 mr-2" />Save Insight</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
