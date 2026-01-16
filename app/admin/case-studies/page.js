'use client'

import { useEffect, useState, useRef } from 'react'
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

export default function CaseStudiesPage() {
    const [caseStudies, setCaseStudies] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        title: '', slug: '', excerpt: '', short_description: '', content: '', client_name: '', industry: '', project_url: '',
        meta_title: '', meta_description: '', is_featured: false, is_published: true, featured_image: []
    })
    const autoSaveTimerRef = useRef(null)
    const [isSaving, setIsSaving] = useState(false)

    const loadCaseStudies = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/case-studies')
            setCaseStudies(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load case studies:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadCaseStudies() }, [])

    // Debounced Auto-save
    useEffect(() => {
        if (!editing || !dialogOpen) return;

        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

        autoSaveTimerRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                const payload = {
                    ...formData,
                    featured_image_id: formData.featured_image?.[0]?.id || null
                };
                await apiCall(`/api/case-studies/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
            } catch (error) {
                console.error('Auto-save failed:', error);
            } finally {
                setIsSaving(false);
            }
        }, 2000);

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        };
    }, [formData, editing, dialogOpen]);

    const handleCreate = async () => {
        try {
            const draftData = {
                title: 'Untitled Case Study',
                slug: `untitled-case-study-${Date.now()}`,
                content: '',
                is_published: false,
                featured_image_id: null
            }
            const newDraft = await apiCall('/api/case-studies', { method: 'POST', body: JSON.stringify(draftData) })
            await loadCaseStudies()
            handleEdit(newDraft)
        } catch (error) {
            alert('Failed to create draft: ' + error.message)
        }
    }

    const handleEdit = (caseStudy) => {
        setEditing(caseStudy)
        setFormData({
            title: caseStudy.title || '', slug: caseStudy.slug || '', excerpt: caseStudy.excerpt || '',
            short_description: caseStudy.short_description || '', content: caseStudy.content || '',
            client_name: caseStudy.client_name || '', industry: caseStudy.industry || '', project_url: caseStudy.project_url || '',
            meta_title: caseStudy.meta_title || '', meta_description: caseStudy.meta_description || '',
            is_featured: caseStudy.is_featured || false, is_published: caseStudy.is_published !== false,
            featured_image: caseStudy.featured_image ? [caseStudy.featured_image] : []
        })
        setDialogOpen(true)
    }

    const handleDelete = async (caseStudy) => {
        if (!confirm(`Delete "${caseStudy.title}"?`)) return
        try {
            await apiCall(`/api/case-studies/${caseStudy.id}`, { method: 'DELETE' })
            await loadCaseStudies()
        } catch (error) {
            alert('Failed to delete: ' + error.message)
        }
    }

    const handleSave = async () => {
        try {
            const payload = { ...formData, featured_image_id: formData.featured_image?.[0]?.id || null }
            if (editing) {
                await apiCall(`/api/case-studies/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) })
            } else {
                await apiCall('/api/case-studies', { method: 'POST', body: JSON.stringify(payload) })
            }
            setDialogOpen(false)
            await loadCaseStudies()
        } catch (error) {
            alert('Failed to save: ' + error.message)
        }
    }

    const columns = [
        {
            key: 'featured_image', header: 'Image', render: (row) => (
                <div className="h-12 w-16 rounded overflow-hidden bg-muted">
                    {row.featured_image?.url ? (
                        <img src={row.featured_image.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground uppercase">No Image</div>
                    )}
                </div>
            )
        },
        { key: 'title', header: 'Title', sortable: true, render: (row) => (<div><div className="font-medium">{row.title}</div><div className="text-xs text-muted-foreground">/{row.slug}</div></div>) },
        { key: 'client_name', header: 'Client', render: (row) => row.client_name || '-' },
        { key: 'industry', header: 'Industry', render: (row) => row.industry || '-' },
        { key: 'is_published', header: 'Status', render: (row) => <StatusBadge status={row.is_published ? 'published' : 'draft'} /> },
        { key: 'view_count', header: 'Views', render: (row) => row.view_count || 0 },
        { key: 'published_at', header: 'Published', sortable: true, render: (row) => row.published_at ? new Date(row.published_at).toLocaleDateString() : '-' },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold">Case Studies</h1><p className="text-muted-foreground mt-1">Manage your case studies</p></div>
                    <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />New Case Study</Button>
                </div>
                <Card className="p-6">
                    {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
                        <DataTable data={caseStudies} columns={columns} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search case studies..." emptyMessage="No case studies yet" />}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Case Study' : 'Create Case Study'}</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => {
                                    const newTitle = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        title: newTitle,
                                        slug: (!prev.slug || prev.slug.startsWith('untitled-case-study-')) ? generateSlug(newTitle) : prev.slug
                                    }));
                                }} placeholder="Enter project title" /></div>
                                <div><Label>Slug *</Label><Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Client Name</Label><Input value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} /></div>
                                    <div><Label>Industry</Label><Input value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} /></div>
                                </div>
                                <div><Label>Project URL</Label><Input value={formData.project_url} onChange={(e) => setFormData({ ...formData, project_url: e.target.value })} placeholder="https://..." /></div>
                                <div><Label>Excerpt</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} /></div>
                                <div><Label>Short Description (for cards)</Label><Textarea value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} rows={2} /></div>
                                <RichEditor label="Content" value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <MediaGallery
                                    label="Featured Image"
                                    images={formData.featured_image}
                                    onChange={(images) => setFormData({ ...formData, featured_image: images })}
                                    maxImages={1}
                                />

                                <Card className="p-4 space-y-4">
                                    <h3 className="font-medium border-b pb-2">Publishing</h3>
                                    <div className="flex items-center justify-between">
                                        <Label>Published</Label>
                                        <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Featured</Label>
                                        <Switch checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                                    </div>
                                </Card>

                                <SeoPreviewEditor
                                    title={formData.title}
                                    slug={formData.slug}
                                    metaTitle={formData.meta_title}
                                    metaDescription={formData.meta_description}
                                    onMetaTitleChange={(value) => setFormData({ ...formData, meta_title: value })}
                                    onMetaDescriptionChange={(value) => setFormData({ ...formData, meta_description: value })}
                                    pathPrefix="/case-studies"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-6 mt-6 border-t">
                            {isSaving && <span className="text-xs text-muted-foreground animate-pulse italic">Saving changes...</span>}
                            {!isSaving && <span className="text-[10px] text-muted-foreground uppercase opacity-50">Saved to Drafts</span>}
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave} className="min-w-[120px]"><Save className="h-4 w-4 mr-2" />Save Case Study</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
