'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'

export default function ProcessStepsAdmin() {
    const [steps, setSteps] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        step_number: 1, title: '', description: '', icon_name: 'Zap', sort_order: 0, is_published: true
    })

    useEffect(() => {
        fetchSteps()
    }, [])

    const fetchSteps = async () => {
        const res = await fetch('/api/homepage?type=process-steps')
        if (res.ok) setSteps(await res.json())
    }

    const handleCreate = () => {
        setEditing(null)
        const nextNumber = steps.length > 0 ? Math.max(...steps.map(s => s.step_number || 0)) + 1 : 1
        setFormData({ step_number: nextNumber, title: '', description: '', icon_name: 'Zap', sort_order: 0, is_published: true })
        setDialogOpen(true)
    }

    const handleEdit = (item) => {
        setEditing(item)
        setFormData({
            step_number: item.step_number || 1, title: item.title || '', description: item.description || '',
            icon_name: item.icon_name || 'Zap', sort_order: item.sort_order || 0, is_published: item.is_published !== false
        })
        setDialogOpen(true)
    }

    const handleSave = async () => {
        const url = editing ? `/api/homepage?type=process-steps&id=${editing.id}` : '/api/homepage?type=process-steps'
        const method = editing ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        if (res.ok) {
            setDialogOpen(false)
            fetchSteps()
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this step?')) return
        const res = await fetch(`/api/homepage?type=process-steps&id=${id}`, { method: 'DELETE' })
        if (res.ok) fetchSteps()
    }

    const columns = [
        { key: 'step_number', label: '#' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description', render: (row) => row.description?.substring(0, 60) + '...' },
        { key: 'icon_name', label: 'Icon' },
        { key: 'is_published', label: 'Published', render: (row) => row.is_published ? '✓' : '✗' },
    ]

    const iconOptions = ['Zap', 'Lightbulb', 'Code', 'Palette', 'Rocket', 'Target', 'CheckCircle', 'Settings']

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Process Steps</h1>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" /> Add Step</Button>
            </div>

            <DataTable data={steps} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit' : 'Add'} Process Step</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Step Number *</Label><Input type="number" min="1" value={formData.step_number} onChange={(e) => setFormData({ ...formData, step_number: parseInt(e.target.value) || 1 })} /></div>
                        <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                        <div><Label>Description *</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
                        <div>
                            <Label>Icon (Lucide Icon Name)</Label>
                            <select className="w-full p-2 border rounded" value={formData.icon_name} onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}>
                                {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                            </select>
                        </div>
                        <div><Label>Sort Order</Label><Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} /></div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} />
                            <Label>Published</Label>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleSave} disabled={!formData.title || !formData.description}>Save</Button>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
