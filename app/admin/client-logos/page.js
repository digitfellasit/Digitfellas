'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { MediaGallery } from '@/components/admin/MediaGallery'

export default function ClientLogosAdmin() {
    const [logos, setLogos] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        name: '', logo_url: '', website_url: '', sort_order: 0, is_published: true, logo_image: []
    })

    useEffect(() => {
        fetchLogos()
    }, [])

    const fetchLogos = async () => {
        const res = await fetch('/api/homepage?type=client-logos')
        if (res.ok) setLogos(await res.json())
    }

    const handleCreate = () => {
        setEditing(null)
        setFormData({ name: '', logo_url: '', website_url: '', sort_order: 0, is_published: true, logo_image: [] })
        setDialogOpen(true)
    }

    const handleEdit = (logo) => {
        setEditing(logo)
        setFormData({
            name: logo.name || '', logo_url: logo.logo_url || '', website_url: logo.website_url || '',
            sort_order: logo.sort_order || 0, is_published: logo.is_published !== false,
            logo_image: logo.logo_url ? [{ url: logo.logo_url }] : []
        })
        setDialogOpen(true)
    }

    const handleSave = async () => {
        const payload = { ...formData, logo_url: formData.logo_image[0]?.url || formData.logo_url }
        const url = editing
            ? `/api/homepage?type=client-logos&id=${editing.id}`
            : '/api/homepage?type=client-logos'
        const method = editing ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            setDialogOpen(false)
            fetchLogos()
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this logo?')) return
        const res = await fetch(`/api/homepage?type=client-logos&id=${id}`, { method: 'DELETE' })
        if (res.ok) fetchLogos()
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'logo_url', label: 'Logo', render: (row) => row.logo_url ? <img src={row.logo_url} alt={row.name} className="h-8 w-auto" /> : '-' },
        { key: 'website_url', label: 'Website' },
        { key: 'sort_order', label: 'Order' },
        { key: 'is_published', label: 'Published', render: (row) => row.is_published ? '✓' : '✗' },
    ]

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Client Logos</h1>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" /> Add Logo</Button>
            </div>

            <DataTable
                data={logos}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit' : 'Add'} Client Logo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                        <MediaGallery label="Logo Image" images={formData.logo_image} onChange={(images) => setFormData({ ...formData, logo_image: images })} maxImages={1} />
                        <div><Label>Website URL</Label><Input value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} placeholder="https://..." /></div>
                        <div><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} /></div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} />
                            <Label>Published</Label>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleSave} disabled={!formData.name}>Save</Button>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
