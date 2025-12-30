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

export default function ProjectsPage() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        title: '', slug: '', description: '', content: '', excerpt: '', client_name: '', project_url: '',
        meta_title: '', meta_description: '', is_featured: false, is_published: true, sort_order: 0, images: [],
        hero: { title: '', subtitle: '', media: [] },
        featured_image: []
    })

    const handleHeroMediaChange = (newImages, variant) => {
        const currentMedia = formData.hero?.media || []
        const others = currentMedia.filter(m => m.variant !== variant)
        const updated = [...others, ...newImages.map(img => ({ ...img, variant }))]
        setFormData({ ...formData, hero: { ...(formData.hero || {}), media: updated } })
    }

    const loadProjects = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/projects')
            setProjects(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load projects:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadProjects() }, [])

    const handleCreate = () => {
        setEditing(null)
        setFormData({
            title: '', slug: '', description: '', content: '', excerpt: '', client_name: '', project_url: '',
            meta_title: '', meta_description: '', is_featured: false, is_published: true, sort_order: 0, images: [],
            hero: { title: '', subtitle: '', media: [] },
            featured_image: []
        })
        setDialogOpen(true)
    }

    const handleEdit = (project) => {
        setEditing(project)
        setFormData({
            title: project.title || '', slug: project.slug || '', description: project.description || '',
            content: project.content || '', excerpt: project.excerpt || '', client_name: project.client_name || '',
            project_url: project.project_url || '', meta_title: project.meta_title || '', meta_description: project.meta_description || '',
            is_featured: project.is_featured || false, is_published: project.is_published !== false, sort_order: project.sort_order || 0,
            images: project.images || [],
            hero: project.hero || { title: '', subtitle: '', media: [] },
            featured_image: project.featured_image ? [project.featured_image] : []
        })
        setDialogOpen(true)
    }

    const handleDelete = async (project) => {
        if (!confirm(`Delete "${project.title}"?`)) return
        try {
            await apiCall(`/api/projects/${project.id}`, { method: 'DELETE' })
            await loadProjects()
        } catch (error) {
            alert('Failed to delete: ' + error.message)
        }
    }

    const handleSave = async () => {
        try {
            const payload = { ...formData, featured_image_id: formData.featured_image?.[0]?.id || null }
            if (editing) {
                await apiCall(`/api/projects/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) })
            } else {
                await apiCall('/api/projects', { method: 'POST', body: JSON.stringify(payload) })
            }
            setDialogOpen(false)
            await loadProjects()
        } catch (error) {
            alert('Failed to save: ' + error.message)
        }
    }

    const columns = [
        { key: 'title', header: 'Title', sortable: true, render: (row) => (<div><div className="font-medium">{row.title}</div><div className="text-xs text-muted-foreground">/{row.slug}</div></div>) },
        { key: 'client_name', header: 'Client', render: (row) => row.client_name || '-' },
        { key: 'is_published', header: 'Status', render: (row) => <StatusBadge status={row.is_published ? 'published' : 'draft'} /> },
        { key: 'created_at', header: 'Created', sortable: true, render: (row) => new Date(row.created_at).toLocaleDateString() },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold">Projects</h1><p className="text-muted-foreground mt-1">Manage your portfolio projects</p></div>
                    <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />Add Project</Button>
                </div>
                <Card className="p-6">
                    {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
                        <DataTable data={projects} columns={columns} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search projects..." emptyMessage="No projects yet" />}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Project' : 'Create Project'}</DialogTitle></DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="grid gap-4">
                            <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: formData.slug || generateSlug(e.target.value) })} /></div>
                            <div><Label>Slug *</Label><Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Client Name</Label><Input value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} /></div>
                                <div><Label>Project URL</Label><Input value={formData.project_url} onChange={(e) => setFormData({ ...formData, project_url: e.target.value })} placeholder="https://..." /></div>
                            </div>
                            <div><Label>Excerpt</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} /></div>
                            <RichEditor label="Full Content" value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
                            <MediaGallery label="Project Images (Gallery)" images={formData.images} onChange={(images) => setFormData({ ...formData, images })} maxImages={-1} />

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

                            <MediaGallery
                                label="Featured Image (List Card)"
                                images={formData.featured_image}
                                onChange={(images) => setFormData({ ...formData, featured_image: images })}
                                maxImages={1}
                            />

                            <div className="flex items-center justify-between">
                                <Label>Published</Label>
                                <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
