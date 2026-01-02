'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { MediaGallery } from '@/components/admin/MediaGallery'

export default function TestimonialsAdmin() {
    const [testimonials, setTestimonials] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        client_name: '', client_role: '', client_company: '', client_image_url: '',
        rating: 5, testimonial_text: '', is_featured: false, is_published: true, sort_order: 0, client_image: []
    })

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        const res = await fetch('/api/homepage?type=testimonials')
        if (res.ok) setTestimonials(await res.json())
    }

    const handleCreate = () => {
        setEditing(null)
        setFormData({ client_name: '', client_role: '', client_company: '', client_image_url: '', rating: 5, testimonial_text: '', is_featured: false, is_published: true, sort_order: 0, client_image: [] })
        setDialogOpen(true)
    }

    const handleEdit = (item) => {
        setEditing(item)
        setFormData({
            client_name: item.client_name || '', client_role: item.client_role || '', client_company: item.client_company || '',
            client_image_url: item.client_image_url || '', rating: item.rating || 5, testimonial_text: item.testimonial_text || '',
            is_featured: item.is_featured || false, is_published: item.is_published !== false, sort_order: item.sort_order || 0,
            client_image: item.client_image_url ? [{ url: item.client_image_url }] : []
        })
        setDialogOpen(true)
    }

    const handleSave = async () => {
        const payload = { ...formData, client_image_url: formData.client_image[0]?.url || formData.client_image_url }
        const url = editing ? `/api/homepage?type=testimonials&id=${editing.id}` : '/api/homepage?type=testimonials'
        const method = editing ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            setDialogOpen(false)
            fetchTestimonials()
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this testimonial?')) return
        const res = await fetch(`/api/homepage?type=testimonials&id=${id}`, { method: 'DELETE' })
        if (res.ok) fetchTestimonials()
    }

    const columns = [
        { key: 'client_name', label: 'Client' },
        { key: 'client_company', label: 'Company' },
        { key: 'rating', label: 'Rating', render: (row) => '⭐'.repeat(row.rating || 5) },
        { key: 'testimonial_text', label: 'Testimonial', render: (row) => row.testimonial_text?.substring(0, 60) + '...' },
        { key: 'is_featured', label: 'Featured', render: (row) => row.is_featured ? '✓' : '✗' },
        { key: 'is_published', label: 'Published', render: (row) => row.is_published ? '✓' : '✗' },
    ]

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Testimonials</h1>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" /> Add Testimonial</Button>
            </div>

            <DataTable data={testimonials} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit' : 'Add'} Testimonial</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Client Name *</Label><Input value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Role</Label><Input value={formData.client_role} onChange={(e) => setFormData({ ...formData, client_role: e.target.value })} placeholder="CEO, Designer, etc." /></div>
                            <div><Label>Company</Label><Input value={formData.client_company} onChange={(e) => setFormData({ ...formData, client_company: e.target.value })} /></div>
                        </div>
                        <MediaGallery label="Client Photo" images={formData.client_image} onChange={(images) => setFormData({ ...formData, client_image: images })} maxImages={1} />
                        <div><Label>Rating</Label><Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} /></div>
                        <div><Label>Testimonial Text *</Label><Textarea value={formData.testimonial_text} onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })} rows={4} /></div>
                        <div><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} /></div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
                                <Label>Featured</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} />
                                <Label>Published</Label>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleSave} disabled={!formData.client_name || !formData.testimonial_text}>Save</Button>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
