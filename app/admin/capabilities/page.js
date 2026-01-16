'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Save, Loader2, Eye, ExternalLink } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable, StatusBadge } from '@/components/admin/DataTable'
import { RichEditor } from '@/components/admin/RichEditor'
import { MediaGallery } from '@/components/admin/MediaGallery'
import { FeaturesEditor } from '@/components/admin/FeaturesEditor'
import { DetailsListEditor } from '@/components/admin/DetailsListEditor'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FaqEditor } from '@/components/admin/FaqEditor'

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

export default function CapabilitiesPage() {
    const [capabilities, setCapabilities] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        short_description: '',
        content: '',
        intro_content: '',
        intro_title: '',
        features: [],
        details_sections: [],
        hero_data: { title: '', tagline: '', desktop: [], mobile: [] },
        excerpt: '',
        icon_url: '',
        meta_title: '',
        meta_description: '',
        is_featured: false,
        is_published: true,
        sort_order: 0,
        featured_image: [],
        faq: [],
        template: 'default',
        cta_title: '',
        cta_description: '',
        cta_button_text: '',
        cta_link: '',
        features_title: '',
        features_description: ''
    })
    const autoSaveTimerRef = useRef(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saving, setSaving] = useState(false)

    const loadCapabilities = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/capabilities')
            setCapabilities(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load capabilities:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCapabilities()
    }, [])

    // Debounced Auto-save
    useEffect(() => {
        if (!editingService || !dialogOpen) return;

        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

        autoSaveTimerRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                const payload = {
                    ...formData,
                    featured_image_id: formData.featured_image?.[0]?.id || null,
                    hero_data: formData.hero_data || { title: '', tagline: '', desktop: [], mobile: [] },
                    features: formData.features || [],
                    details_sections: formData.details_sections || [],
                    faq: formData.faq || []
                };
                await apiCall(`/api/capabilities/${editingService.id}`, { method: 'PUT', body: JSON.stringify(payload) });
            } catch (error) {
                console.error('Auto-save failed:', error);
            } finally {
                setIsSaving(false);
            }
        }, 2000);

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        };
    }, [formData, editingService, dialogOpen]);

    const handleCreate = async () => {
        try {
            const draftData = {
                title: 'Untitled Capability',
                slug: `untitled-capability-${Date.now()}`,
                description: '',
                is_published: false,
                template: 'default'
            }
            const newDraft = await apiCall('/api/capabilities', { method: 'POST', body: JSON.stringify(draftData) })
            await loadCapabilities()
            handleEdit(newDraft)
        } catch (error) {
            alert('Failed to create draft: ' + error.message)
        }
    }

    const handleEdit = (capability) => {
        setEditingService(capability)

        // Backward compatibility for single details_section
        let sections = capability.details_sections || []
        if (sections.length === 0 && capability.details_section?.content) {
            sections = [capability.details_section]
        }

        setFormData({
            title: capability.title || '',
            slug: capability.slug || '',
            description: capability.description || '',
            short_description: capability.short_description || '',
            content: capability.content || '',
            intro_content: capability.intro_content || '',
            intro_title: capability.intro_title || '',
            features: capability.features || [],
            details_sections: sections,
            hero_data: capability.hero_data || { title: '', tagline: '', desktop: [], mobile: [] },
            excerpt: capability.excerpt || '',
            icon_url: capability.icon_url || '',
            meta_title: capability.meta_title || '',
            meta_description: capability.meta_description || '',
            is_featured: capability.is_featured || false,
            is_published: capability.is_published !== false,
            sort_order: capability.sort_order || 0,
            featured_image: capability.featured_image ? [capability.featured_image] : [],
            faq: capability.faq || [],
            template: capability.template || 'default',
            cta_title: capability.cta_title || '',
            cta_description: capability.cta_description || '',
            cta_button_text: capability.cta_button_text || '',
            cta_link: capability.cta_link || '',
            features_title: capability.features_title || '',
            features_description: capability.features_description || ''
        })
        setDialogOpen(true)
    }

    const handleDelete = async (capability) => {
        if (!confirm(`Delete "${capability.title}"?`)) return
        try {
            await apiCall(`/api/capabilities/${capability.id}`, { method: 'DELETE' })
            await loadCapabilities()
        } catch (error) {
            alert('Failed to delete capability: ' + error.message)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const payload = { ...formData, featured_image_id: formData.featured_image?.[0]?.id || null }
            if (editingService) {
                await apiCall(`/api/capabilities/${editingService.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                })
            } else {
                await apiCall('/api/capabilities', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                })
            }
            setDialogOpen(false)
            await loadCapabilities()
        } catch (error) {
            alert('Failed to save capability: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleTitleChange = (title) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: (!prev.slug || prev.slug.startsWith('untitled-capability-')) ? generateSlug(title) : prev.slug,
            meta_title: (!prev.meta_title || prev.meta_title === prev.title) ? title : prev.meta_title,
        }))
    }

    const handlePreview = () => {
        // Save current form state to localStorage for the preview page to pick up
        localStorage.setItem('df_preview_service', JSON.stringify(formData))
        window.open('/admin/preview/service', '_blank')
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
        { key: 'is_published', header: 'Status', render: (row) => <StatusBadge status={row.is_published ? 'published' : 'draft'} /> },
        { key: 'sort_order', header: 'Order' },
        {
            key: 'created_at',
            header: 'Updated',
            render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '-',
        },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Capabilities</h1>
                        <p className="text-muted-foreground mt-1">Manage your capability offerings</p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Capability
                    </Button>
                </div>

                <Card className="p-6">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading capabilities...</div>
                    ) : (
                        <DataTable
                            data={capabilities}
                            columns={columns}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            searchPlaceholder="Search capabilities..."
                            emptyMessage="No capabilities yet."
                        />
                    )}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle>{editingService ? 'Edit Capability' : 'Create Capability'}</DialogTitle>
                        {formData.slug && (
                            <Button variant="outline" size="sm" onClick={handlePreview} className="mr-8">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview Page
                            </Button>
                        )}
                    </DialogHeader>

                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="hero">Hero & Header</TabsTrigger>
                            <TabsTrigger value="content">Page Content</TabsTrigger>
                            <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
                        </TabsList>

                        <div className="py-6 space-y-6">
                            <TabsContent value="basic" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Title *</Label>
                                        <Input value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Capability title" />
                                    </div>
                                    <div>
                                        <Label>Slug *</Label>
                                        <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="service-slug" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Template Layout</Label>
                                        <Select value={formData.template} onValueChange={(val) => setFormData({ ...formData, template: val })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Layout" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Default (Corporate Standard)</SelectItem>
                                                <SelectItem value="centered">Centered Content</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Centered moves the main heading and content to the center.
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Icon URL</Label>
                                        <Input value={formData.icon_url} onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })} placeholder="/uploads/icon.svg" />
                                    </div>
                                </div>
                                <div>
                                    <Label>Short Description (Card Summary)</Label>
                                    <Textarea value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} rows={2} />
                                </div>
                                <div>
                                    <Label>Long Description (Detailed)</Label>
                                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <MediaGallery label="Card Image (Featured)" images={formData.featured_image} onChange={imgs => setFormData({ ...formData, featured_image: imgs })} maxImages={1} />
                                        <div>
                                            <Label>Sort Order</Label>
                                            <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="hero" className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Hero Title</Label>
                                            <Input value={formData.hero_data?.title || ''} onChange={e => setFormData({ ...formData, hero_data: { ...formData.hero_data, title: e.target.value } })} placeholder="Title Overlay" />
                                        </div>
                                        <div>
                                            <Label>Hero Tagline</Label>
                                            <Input value={formData.hero_data?.tagline || ''} onChange={e => setFormData({ ...formData, hero_data: { ...formData.hero_data, tagline: e.target.value } })} placeholder="Small tagline" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <MediaGallery
                                            label="Desktop Background"
                                            images={formData.hero_data?.desktop || []}
                                            onChange={imgs => setFormData({ ...formData, hero_data: { ...formData.hero_data, desktop: imgs } })}
                                            maxImages={1}
                                        />
                                        <MediaGallery
                                            label="Mobile Background"
                                            images={formData.hero_data?.mobile || []}
                                            onChange={imgs => setFormData({ ...formData, hero_data: { ...formData.hero_data, mobile: imgs } })}
                                            maxImages={1}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">1. Intro Content (Below Hero)</h3>
                                    <div className="mb-4">
                                        <Label>Intro Title (Centered)</Label>
                                        <Input
                                            value={formData.intro_title || ''}
                                            onChange={e => setFormData({ ...formData, intro_title: e.target.value })}
                                            placeholder="e.g., Driving Digital Transformation"
                                        />
                                    </div>
                                    <RichEditor value={formData.intro_content || ''} onChange={val => setFormData({ ...formData, intro_content: val })} label="Introduction Text" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">2. Features Grid</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded-md bg-slate-50">
                                        <div>
                                            <Label>Section Title</Label>
                                            <Input
                                                value={formData.features_title}
                                                onChange={e => setFormData({ ...formData, features_title: e.target.value })}
                                                placeholder="Core Capabilities"
                                            />
                                        </div>
                                        <div>
                                            <Label>Section Description (Optional)</Label>
                                            <Input
                                                value={formData.features_description}
                                                onChange={e => setFormData({ ...formData, features_description: e.target.value })}
                                                placeholder="Brief intro..."
                                            />
                                        </div>
                                    </div>

                                    <FeaturesEditor value={formData.features || []} onChange={val => setFormData({ ...formData, features: val })} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">3. Details / Swap Sections</h3>
                                    <DetailsListEditor value={formData.details_sections || []} onChange={val => setFormData({ ...formData, details_sections: val })} />
                                </div>

                                <div className="space-y-2 pt-8 border-t">
                                    <h3 className="font-semibold text-lg">4. Frequently Asked Questions</h3>
                                    <FaqEditor value={formData.faq || []} onChange={val => setFormData({ ...formData, faq: val })} />
                                </div>

                                <div className="space-y-4 pt-8 border-t">
                                    <h3 className="font-semibold text-lg">5. Call to Action (Bottom Section)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>CTA Title</Label>
                                            <Input value={formData.cta_title} onChange={e => setFormData({ ...formData, cta_title: e.target.value })} placeholder="Ready to build?" />
                                        </div>
                                        <div>
                                            <Label>Button Text</Label>
                                            <Input value={formData.cta_button_text} onChange={e => setFormData({ ...formData, cta_button_text: e.target.value })} placeholder="Work With Us" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>CTA Description</Label>
                                        <Textarea value={formData.cta_description} onChange={e => setFormData({ ...formData, cta_description: e.target.value })} placeholder="Short text below title..." />
                                    </div>
                                    <div>
                                        <Label>CTA Link</Label>
                                        <Input value={formData.cta_link} onChange={e => setFormData({ ...formData, cta_link: e.target.value })} placeholder="/contact" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="seo" className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label>Meta Title</Label>
                                        <Input value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} placeholder="SEO Title" />
                                    </div>
                                    <div>
                                        <Label>Meta Description</Label>
                                        <Textarea value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} rows={2} />
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-4">
                                        <Label>Published Status</Label>
                                        <Switch checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    <div className="flex justify-end items-center gap-4 pt-6 mt-2 border-t">
                        {isSaving && <span className="text-xs text-muted-foreground animate-pulse italic">Saving changes...</span>}
                        {!isSaving && <span className="text-[10px] text-muted-foreground uppercase opacity-50">Saved to Drafts</span>}
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                            <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Capability
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
