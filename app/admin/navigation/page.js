'use client'

import { useEffect, useState } from 'react'
import { Plus, Save, GripVertical } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

async function apiCall(url, options = {}) {
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } })
    if (!res.ok) throw new Error((await res.json().catch(() => ({ error: 'Request failed' }))).error || `HTTP ${res.status}`)
    return res.json()
}

export default function NavigationPage() {
    const [navItems, setNavItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [formData, setFormData] = useState({
        label: '', url: '', parent_id: null, icon: '', target: '_self', is_active: true, sort_order: 0
    })

    const loadNavItems = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/navigation')
            setNavItems(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load navigation:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadNavItems() }, [])

    const handleCreate = () => {
        setEditing(null)
        setFormData({ label: '', url: '', parent_id: null, icon: '', target: '_self', is_active: true, sort_order: 0 })
        setDialogOpen(true)
    }

    const handleEdit = (item) => {
        setEditing(item)
        setFormData({
            label: item.label || '', url: item.url || '', parent_id: item.parent_id, icon: item.icon || '',
            target: item.target || '_self', is_active: item.is_active !== false, sort_order: item.sort_order || 0
        })
        setDialogOpen(true)
    }

    const handleDelete = async (item) => {
        if (!confirm(`Delete "${item.label}"?`)) return
        try {
            await apiCall(`/api/navigation/${item.id}`, { method: 'DELETE' })
            await loadNavItems()
        } catch (error) {
            alert('Failed to delete: ' + error.message)
        }
    }

    const handleSave = async () => {
        try {
            if (editing) {
                await apiCall(`/api/navigation/${editing.id}`, { method: 'PUT', body: JSON.stringify(formData) })
            } else {
                await apiCall('/api/navigation', { method: 'POST', body: JSON.stringify(formData) })
            }
            setDialogOpen(false)
            await loadNavItems()
        } catch (error) {
            alert('Failed to save: ' + error.message)
        }
    }

    const columns = [
        { key: 'sort_order', header: 'Order', render: (row) => <span className="text-muted-foreground">{row.sort_order}</span> },
        { key: 'label', header: 'Label', sortable: true, render: (row) => <span className="font-medium">{row.label}</span> },
        { key: 'url', header: 'URL', render: (row) => <span className="text-sm text-muted-foreground">{row.url}</span> },
        { key: 'target', header: 'Target', render: (row) => <span className="text-xs">{row.target}</span> },
        { key: 'is_active', header: 'Status', render: (row) => row.is_active ? <span className="text-green-600">●</span> : <span className="text-gray-400">●</span> },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Navigation</h1>
                        <p className="text-muted-foreground mt-1">Manage your site navigation menu</p>
                    </div>
                    <Button onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />Add Menu Item</Button>
                </div>
                <Card className="p-6">
                    {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
                        <DataTable data={navItems} columns={columns} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search menu items..." emptyMessage="No navigation items yet" />}
                </Card>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Menu Item' : 'Create Menu Item'}</DialogTitle></DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="grid gap-4">
                            <div>
                                <Label>Label *</Label>
                                <Input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Home" />
                            </div>
                            <div>
                                <Label>URL *</Label>
                                <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="/" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Target</Label>
                                    <Select value={formData.target} onValueChange={(value) => setFormData({ ...formData, target: value })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_self">Same Window</SelectItem>
                                            <SelectItem value="_blank">New Window</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Sort Order</Label>
                                    <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>
                            <div>
                                <Label>Icon (optional)</Label>
                                <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="home" />
                                <p className="text-xs text-muted-foreground mt-1">Lucide icon name</p>
                            </div>
                            <div className="flex items-center justify-between border-t pt-4">
                                <div><Label>Active</Label><p className="text-sm text-muted-foreground">Show in navigation</p></div>
                                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Menu Item</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
