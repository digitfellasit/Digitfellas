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

export default function PagesPage() {
    const [pages, setPages] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        title: '', slug: '', content: '', template: 'default', meta_title: '', meta_description: '',
        is_published: true, show_in_menu: false, sort_order: 0,
        featured_image: []
    })

    const loadPages = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/pages')
            setPages(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load pages:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadPages() }, [])

    const handleCreate = () => {
        setEditing(null)
        setFormData({ title: '', slug: '', content: '', template: 'default', meta_title: '', meta_description: '', is_published: true, show_in_menu: false, sort_order: 0, featured_image: [] })
        setDialogOpen(true)
    }

    const handleEdit = (page) => {
        setEditing(page)
        setFormData({
            title: page.title || '', slug: page.slug || '', content: page.content || '', template: page.template || 'default',
            meta_title: page.meta_title || '', meta_description: page.meta_description || '',
            is_published: page.is_published !== false, show_in_menu: page.show_in_menu || false, sort_order: page.sort_order || 0,
            featured_image: page.featured_image ? [page.featured_image] : []
        })
        setDialogOpen(true)
    }

    const handleDelete = async (page) => {
        if (!confirm(`Delete "${page.title}"?`)) return
        try {
            await apiCall(`/api/pages/${page.id}`, { method: 'DELETE' })
            await loadPages()
        } catch (error) {
            alert('Failed to delete: ' + error.message)
        }
    }

    const handleSave = async () => {
        try {
            const payload = { ...formData, featured_image_id: formData.featured_image?.[0]?.id || null }
            if (editing) {
                await apiCall(`/api/pages/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) })
            } else {
                await apiCall('/api/pages', { method: 'POST', body: JSON.stringify(payload) })
            }
            setDialogOpen(false)
            await loadPages()
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
        { key: 'template', header: 'Template', render: (row) => <span className="text-sm">{row.template}</span> },
        { key: 'is_published', header: 'Status', render: (row) => <StatusBadge status={row.is_published ? 'published' : 'draft'} /> },
        { key: 'show_in_menu', header: 'In Menu', render: (row) => row.show_in_menu ? '✓' : '' },
        { key: 'created_at', header: 'Created', sortable: true, render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-' },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold">CMS Pages</h1><p className="text-muted-foreground mt-1">Create and manage custom pages</p></div>
                    <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />New Page</Button>
                </div>
                <Card className="p-6">
                    {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
                        <DataTable data={pages} columns={columns} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search pages..." emptyMessage="No pages yet" />}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Page' : 'Create Page'}</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <Card className="p-4 space-y-4">
                                    <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: formData.slug || generateSlug(e.target.value) })} placeholder="Enter page title" /></div>
                                    <div><Label>Slug *</Label><Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="page-slug" /></div>
                                </Card>
                                <Card className="p-4">
                                    <RichEditor label="Page Content *" value={formData.content} onChange={(content) => setFormData({ ...formData, content })} minHeight="500px" />
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card className="p-4 space-y-4">
                                    <h3 className="font-medium border-b pb-2">Status & visibility</h3>
                                    <div className="flex items-center justify-between">
                                        <div><Label>Published</Label><p className="text-[10px] text-muted-foreground uppercase">Visible on site</p></div>
                                        <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div><Label>Show in Menu</Label><p className="text-[10px] text-muted-foreground uppercase">Add to navigation</p></div>
                                        <Switch checked={formData.show_in_menu} onCheckedChange={(checked) => setFormData({ ...formData, show_in_menu: checked })} />
                                    </div>
                                    <div className="pt-2">
                                        <Label>Template</Label>
                                        <Input value={formData.template} onChange={(e) => setFormData({ ...formData, template: e.target.value })} placeholder="default" />
                                    </div>
                                    <div className="pt-2">
                                        <Label>Sort Order</Label>
                                        <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} />
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

                                <Card className="p-4 space-y-4">
                                    <h3 className="font-medium border-b pb-2">SEO Settings</h3>
                                    <div><Label>Meta Title</Label><Input value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} placeholder="SEO Title" /></div>
                                    <div><Label>Meta Description</Label><Textarea value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} rows={4} placeholder="SEO Description" /></div>
                                </Card>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} className="min-w-[120px]"><Save className="h-4 w-4 mr-2" />Save Page</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
