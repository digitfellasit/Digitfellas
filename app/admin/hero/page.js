'use client'

import { useEffect, useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { MediaGallery } from '@/components/admin/MediaGallery'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

async function apiCall(url, options = {}) {
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } })
    if (!res.ok) throw new Error((await res.json().catch(() => ({ error: 'Request failed' }))).error || `HTTP ${res.status}`)
    return res.json()
}

export default function HeroPage() {
    const [heroes, setHeroes] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        page_key: 'home', title: '', subtitle: '', kicker: '', primary_cta_label: '', primary_cta_url: '',
        secondary_cta_label: '', secondary_cta_url: '', background_type: 'image', background_video_url: '', is_active: true, media: []
    })

    const loadHeroes = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/hero')
            setHeroes(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load hero sections:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadHeroes() }, [])

    const handleCreate = () => {
        setEditing(null)
        setFormData({ page_key: 'home', title: '', subtitle: '', kicker: '', primary_cta_label: '', primary_cta_url: '', secondary_cta_label: '', secondary_cta_url: '', background_type: 'image', background_video_url: '', is_active: true, media: [] })
        setDialogOpen(true)
    }

    const handleEdit = (hero) => {
        setEditing(hero)
        setFormData({
            page_key: hero.page_key || 'home', title: hero.title || '', subtitle: hero.subtitle || '', kicker: hero.kicker || '',
            primary_cta_label: hero.primary_cta_label || '', primary_cta_url: hero.primary_cta_url || '',
            secondary_cta_label: hero.secondary_cta_label || '', secondary_cta_url: hero.secondary_cta_url || '',
            background_type: hero.background_type || 'image', background_video_url: hero.background_video_url || '',
            is_active: hero.is_active !== false, media: hero.media || []
        })
        setDialogOpen(true)
    }

    const handleDelete = async (hero) => {
        if (!confirm(`Delete hero section for "${hero.page_key}"?`)) return
        try {
            await apiCall(`/api/hero/${hero.id}`, { method: 'DELETE' })
            await loadHeroes()
        } catch (error) {
            alert('Failed to delete: ' + error.message)
        }
    }

    const handleSave = async () => {
        try {
            if (editing) {
                await apiCall(`/api/hero/${editing.id}`, { method: 'PUT', body: JSON.stringify(formData) })
            } else {
                await apiCall('/api/hero', { method: 'POST', body: JSON.stringify(formData) })
            }
            setDialogOpen(false)
            await loadHeroes()
        } catch (error) {
            alert('Failed to save: ' + error.message)
        }
    }

    const columns = [
        { key: 'page_key', header: 'Page', sortable: true, render: (row) => <span className="font-medium capitalize">{row.page_key}</span> },
        { key: 'title', header: 'Title', render: (row) => <div className="max-w-md truncate">{row.title}</div> },
        { key: 'kicker', header: 'Kicker', render: (row) => row.kicker || '-' },
        { key: 'is_active', header: 'Status', render: (row) => row.is_active ? <span className="text-green-600">●</span> : <span className="text-gray-400">●</span> },
        { key: 'created_at', header: 'Created', sortable: true, render: (row) => new Date(row.created_at).toLocaleDateString() },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold">Hero Sections</h1><p className="text-muted-foreground mt-1">Manage hero content for different pages</p></div>
                    <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />Add Hero Section</Button>
                </div>
                <Card className="p-6">
                    {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
                        <DataTable data={heroes} columns={columns} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search hero sections..." emptyMessage="No hero sections yet" />}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Hero Section' : 'Create Hero Section'}</DialogTitle></DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="grid gap-4">
                            <div>
                                <Label>Page Key *</Label>
                                <Select value={formData.page_key} onValueChange={(value) => setFormData({ ...formData, page_key: value })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="home">Home</SelectItem>
                                        <SelectItem value="about">About</SelectItem>
                                        <SelectItem value="services">Services</SelectItem>
                                        <SelectItem value="projects">Projects</SelectItem>
                                        <SelectItem value="blog">Blog</SelectItem>
                                        <SelectItem value="contact">Contact</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>Kicker (Small text above title)</Label><Input value={formData.kicker} onChange={(e) => setFormData({ ...formData, kicker: e.target.value })} placeholder="Digitfellas • IT Solutions" /></div>
                            <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Main hero title" /></div>
                            <div><Label>Subtitle</Label><Textarea value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} rows={3} placeholder="Hero description" /></div>

                            <div className="border-t pt-4">
                                <h3 className="font-medium mb-4">Call to Action Buttons</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Primary CTA Label</Label><Input value={formData.primary_cta_label} onChange={(e) => setFormData({ ...formData, primary_cta_label: e.target.value })} placeholder="Get Started" /></div>
                                    <div><Label>Primary CTA URL</Label><Input value={formData.primary_cta_url} onChange={(e) => setFormData({ ...formData, primary_cta_url: e.target.value })} placeholder="/contact" /></div>
                                    <div><Label>Secondary CTA Label</Label><Input value={formData.secondary_cta_label} onChange={(e) => setFormData({ ...formData, secondary_cta_label: e.target.value })} placeholder="Learn More" /></div>
                                    <div><Label>Secondary CTA URL</Label><Input value={formData.secondary_cta_url} onChange={(e) => setFormData({ ...formData, secondary_cta_url: e.target.value })} placeholder="/about" /></div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-medium mb-4">Background</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Background Type</Label>
                                        <Select value={formData.background_type} onValueChange={(value) => setFormData({ ...formData, background_type: value })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="image">Image</SelectItem>
                                                <SelectItem value="video">Video</SelectItem>
                                                <SelectItem value="gradient">Gradient</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {formData.background_type === 'video' && (
                                        <div><Label>Video URL</Label><Input value={formData.background_video_url} onChange={(e) => setFormData({ ...formData, background_video_url: e.target.value })} placeholder="https://..." /></div>
                                    )}
                                    {formData.background_type === 'image' && (
                                        <MediaGallery label="Hero Images (Desktop/Mobile)" images={formData.media} onChange={(media) => setFormData({ ...formData, media })} maxImages={-1} />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <div><Label>Active</Label><p className="text-sm text-muted-foreground">Display this hero section</p></div>
                                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Hero Section</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
