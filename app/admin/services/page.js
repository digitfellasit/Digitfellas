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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

async function apiCall(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    })
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || `HTTP ${res.status}`)
    }
    return res.json()
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export default function ServicesPage() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        content: '',
        excerpt: '',
        icon_url: '',
        meta_title: '',
        meta_description: '',
        is_featured: false,
        is_published: true,
        is_published: true,
        sort_order: 0,
        hero: { title: '', subtitle: '', media: [] },
        featured_image: []
    })

    const handleHeroMediaChange = (newImages, variant) => {
        const currentMedia = formData.hero?.media || []
        const others = currentMedia.filter(m => m.variant !== variant)
        const updated = [...others, ...newImages.map(img => ({ ...img, variant }))]
        setFormData({ ...formData, hero: { ...(formData.hero || {}), media: updated } })
    }

    const loadServices = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/services')
            setServices(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load services:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadServices()
    }, [])

    const handleCreate = () => {
        setEditingService(null)
        setFormData({
            title: '',
            slug: '',
            description: '',
            content: '',
            excerpt: '',
            icon_url: '',
            meta_title: '',
            meta_description: '',
            is_featured: false,
            is_published: true,
            is_published: true,
            sort_order: 0,
            hero: { title: '', subtitle: '', media: [] },
            featured_image: []
        })
        setDialogOpen(true)
    }

    const handleEdit = (service) => {
        setEditingService(service)
        setFormData({
            title: service.title || '',
            slug: service.slug || '',
            description: service.description || '',
            content: service.content || '',
            excerpt: service.excerpt || '',
            icon_url: service.icon_url || '',
            meta_title: service.meta_title || '',
            meta_description: service.meta_description || '',
            is_featured: service.is_featured || false,
            is_published: service.is_published !== false,
            is_published: service.is_published !== false,
            sort_order: service.sort_order || 0,
            hero: service.hero || { title: '', subtitle: '', media: [] },
            featured_image: service.featured_image ? [service.featured_image] : []
        })
        setDialogOpen(true)
    }

    const handleDelete = async (service) => {
        if (!confirm(`Delete "${service.title}"?`)) return

        try {
            await apiCall(`/api/services/${service.id}`, { method: 'DELETE' })
            await loadServices()
        } catch (error) {
            alert('Failed to delete service: ' + error.message)
        }
    }

    const handleSave = async () => {
        try {
            const payload = { ...formData, featured_image_id: formData.featured_image?.[0]?.id || null }
            if (editingService) {
                await apiCall(`/api/services/${editingService.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                })
            } else {
                await apiCall('/api/services', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                })
            }
            setDialogOpen(false)
            await loadServices()
        } catch (error) {
            alert('Failed to save service: ' + error.message)
        }
    }

    const handleTitleChange = (title) => {
        setFormData({
            ...formData,
            title,
            slug: formData.slug || generateSlug(title),
            meta_title: formData.meta_title || title,
        })
    }

    const columns = [
        {
            key: 'title',
            header: 'Title',
            sortable: true,
            render: (row) => (
                <div>
                    <div className="font-medium">{row.title}</div>
                    <div className="text-xs text-muted-foreground">/{row.slug}</div>
                </div>
            ),
        },
        {
            key: 'excerpt',
            header: 'Excerpt',
            render: (row) => (
                <div className="max-w-md truncate text-sm text-muted-foreground">
                    {row.excerpt || row.description}
                </div>
            ),
        },
        {
            key: 'is_published',
            header: 'Status',
            render: (row) => (
                <StatusBadge status={row.is_published ? 'published' : 'draft'} />
            ),
        },
        {
            key: 'is_featured',
            header: 'Featured',
            render: (row) => (row.is_featured ? '⭐' : ''),
        },
        {
            key: 'created_at',
            header: 'Created',
            sortable: true,
            render: (row) => new Date(row.created_at).toLocaleDateString(),
        },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Services</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your service offerings
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                    </Button>
                </div>

                <Card className="p-6">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Loading services...
                        </div>
                    ) : (
                        <DataTable
                            data={services}
                            columns={columns}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            searchPlaceholder="Search services..."
                            emptyMessage="No services yet. Create your first service!"
                        />
                    )}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingService ? 'Edit Service' : 'Create Service'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="grid gap-4">
                            <div>
                                <Label>Title *</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Service title"
                                />
                            </div>

                            <div>
                                <Label>Slug *</Label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="service-slug"
                                />
                            </div>

                            <div>
                                <Label>Excerpt</Label>
                                <Textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Short description for cards and previews"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Service description"
                                    rows={3}
                                />
                            </div>

                            <RichEditor
                                label="Full Content"
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Icon URL (optional)</Label>
                                    <Input
                                        value={formData.icon_url}
                                        onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                                        placeholder="/uploads/icon.svg"
                                    />
                                </div>

                                <div>
                                    <Label>Sort Order</Label>
                                    <Input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>


                        <MediaGallery
                            label="Featured Image (List Card)"
                            images={formData.featured_image}
                            onChange={(images) => setFormData({ ...formData, featured_image: images })}
                            maxImages={1}
                        />

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-4">Hero Banner (Desktop & Mobile)</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Hero Title</Label>
                                        <Input
                                            value={formData.hero?.title || ''}
                                            onChange={e => setFormData({ ...formData, hero: { ...(formData.hero || {}), title: e.target.value } })}
                                            placeholder="Overlay title"
                                        />
                                    </div>
                                    <div>
                                        <Label>Hero Subtitle</Label>
                                        <Input
                                            value={formData.hero?.subtitle || ''}
                                            onChange={e => setFormData({ ...formData, hero: { ...(formData.hero || {}), subtitle: e.target.value } })}
                                            placeholder="Overlay subtitle"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <MediaGallery
                                        label="Desktop Banner Image"
                                        images={formData.hero?.media?.filter(m => m.variant === 'desktop') || []}
                                        onChange={imgs => handleHeroMediaChange(imgs, 'desktop')}
                                        maxImages={1}
                                        variant="desktop"
                                    />
                                    <MediaGallery
                                        label="Mobile Banner Image"
                                        images={formData.hero?.media?.filter(m => m.variant === 'mobile') || []}
                                        onChange={imgs => handleHeroMediaChange(imgs, 'mobile')}
                                        maxImages={1}
                                        variant="mobile"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-4">SEO Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label>Meta Title</Label>
                                    <Input
                                        value={formData.meta_title}
                                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                        placeholder="SEO title"
                                    />
                                </div>
                                <div>
                                    <Label>Meta Description</Label>
                                    <Textarea
                                        value={formData.meta_description}
                                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                        placeholder="SEO description"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Published</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make this service visible on the website
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.is_published}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Featured</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Highlight this service
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Service
                        </Button>
                    </div>

                </DialogContent>
            </Dialog >
        </AdminLayout >
    )
}
