'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Save, Move, Edit2 } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const PREDEFINED_LINKS = [
    { label: 'Home', value: '/' },
    { label: 'About', value: '/about' },
    { label: 'Capabilities (Services)', value: '/services' },
    { label: 'Services List', value: '#ProfessionalServices' },
    { label: 'How We Work', value: '#how-we-work' },
    { label: 'Case Studies', value: '/case-studies' },
    { label: 'Insights (Blog)', value: '/insights' },
    { label: 'Partnerships', value: '#partnerships' },
    { label: 'Contact', value: '/contact' },
]

export default function NavigationAdmin() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    // Form State
    const [formData, setFormData] = useState({
        label: '',
        url: '',
        type: 'link', // link, dropdown
        sort_order: 0,
        is_active: true
    })

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/navigation')
            if (res.ok) {
                const data = await res.json()
                setItems(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            const method = editingItem ? 'PUT' : 'POST'
            const body = editingItem ? { ...formData, id: editingItem.id } : formData

            const res = await fetch('/api/navigation', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                setIsDialogOpen(false)
                setEditingItem(null)
                setFormData({ label: '', url: '', type: 'link', sort_order: 0, is_active: true })
                fetchItems()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            await fetch(`/api/navigation?id=${id}`, { method: 'DELETE' })
            fetchItems()
        } catch (error) {
            console.error(error)
        }
    }

    const openEdit = (item) => {
        setEditingItem(item)
        setFormData({
            label: item.label,
            url: item.url,
            type: item.type,
            sort_order: item.sort_order,
            is_active: item.is_active
        })
        setIsDialogOpen(true)
    }

    const openNew = () => {
        setEditingItem(null)
        setFormData({ label: '', url: '', type: 'link', sort_order: items.length * 10, is_active: true })
        setIsDialogOpen(true)
    }

    return (
        <div className="container py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
                    <p className="text-muted-foreground">Manage header menu items.</p>
                </div>
                <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Label</label>
                            <Input
                                value={formData.label}
                                onChange={e => setFormData({ ...formData, label: e.target.value })}
                                placeholder="e.g. About"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Type</label>
                            <Select
                                value={formData.type}
                                onValueChange={val => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="link">Link</SelectItem>
                                    <SelectItem value="dropdown">Dropdown (Parent)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.type === 'link' && (
                            <div>
                                <label className="text-sm font-medium mb-1 block">URL (Page or Section)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            value={formData.url}
                                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                                            placeholder="/path or #section"
                                        />
                                    </div>
                                    <Select onValueChange={val => setFormData({ ...formData, url: val })}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PREDEFINED_LINKS.map(l => (
                                                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium mb-1 block">Sort Order</label>
                            <Input
                                type="number"
                                value={formData.sort_order}
                                onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    items.map(item => (
                        <Card key={item.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-muted w-8 h-8 flex items-center justify-center rounded text-xs font-bold">
                                    {item.sort_order}
                                </div>
                                <div>
                                    <div className="font-bold">{item.label}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.type === 'dropdown' ? 'Dropdown Menu' : item.url}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
