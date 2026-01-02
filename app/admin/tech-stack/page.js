'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import { MediaGallery } from '@/components/admin/MediaGallery'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TechStackAdmin() {
    const [techStack, setTechStack] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        name: '', icon_url: '', category: 'frontend', website_url: '', sort_order: 0, is_published: true, icon_image: []
    })

    useEffect(() => {
        fetchTechStack()
    }, [])

    const fetchTechStack = async () => {
        const res = await fetch('/api/homepage?type=tech-stack')
        if (res.ok) setTechStack(await res.json())
    }

    const handleCreate = () => {
        setEditing(null)
        setFormData({ name: '', icon_url: '', category: 'frontend', website_url: '', sort_order: 0, is_published: true, icon_image: [] })
        setDialogOpen(true)
    }

    const handleEdit = (item) => {
        setEditing(item)
        setFormData({
            name: item.name || '', icon_url: item.icon_url || '', category: item.category || 'frontend',
            website_url: item.website_url || '', sort_order: item.sort_order || 0, is_published: item.is_published !== false,
            icon_image: item.icon_url ? [{ url: item.icon_url }] : []
        })
        setDialogOpen(true)
    }

    const handleSave = async () => {
        const payload = { ...formData, icon_url: formData.icon_image[0]?.url || formData.icon_url }
        const url = editing ? `/api/homepage?type=tech-stack&id=${editing.id}` : '/api/homepage?type=tech-stack'
        const method = editing ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            setDialogOpen(false)
            fetchTechStack()
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this tech item?')) return
        const res = await fetch(`/api/homepage?type=tech-stack&id=${id}`, { method: 'DELETE' })
        if (res.ok) fetchTechStack()
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'icon_url', label: 'Icon', render: (row) => row.icon_url ? <img src={row.icon_url} alt={row.name} className="h-8 w-auto" /> : '-' },
        { key: 'category', label: 'Category' },
        { key: 'sort_order', label: 'Order' },
        { key: 'is_published', label: 'Published', render: (row) => row.is_published ? '✓' : '✗' },
    ]

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tech Stack</h1>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" /> Add Technology</Button>
            </div>

            <DataTable data={techStack} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit' : 'Add'} Technology</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                        <MediaGallery label="Icon/Logo" images={formData.icon_image} onChange={(images) => setFormData({ ...formData, icon_image: images })} maxImages={1} />
                        <div>
                            <Label>Category</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="frontend">Frontend</SelectItem>
                                    <SelectItem value="backend">Backend</SelectItem>
                                    <SelectItem value="database">Database</SelectItem>
                                    <SelectItem value="tools">Tools</SelectItem>
                                    <SelectItem value="cloud">Cloud</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
