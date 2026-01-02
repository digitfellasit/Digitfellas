'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MediaGallery } from '@/components/admin/MediaGallery'

export function FeaturesEditor({ value = [], onChange }) {
    const handleAdd = () => {
        onChange([...value, { id: crypto.randomUUID(), title: '', description: '', image: [] }])
    }

    const handleRemove = (index) => {
        const next = [...value]
        next.splice(index, 1)
        onChange(next)
    }

    const handleChange = (index, field, val) => {
        const next = [...value]
        next[index] = { ...next[index], [field]: val }
        onChange(next)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Features Grid (Unlimited)</Label>
                <Button variant="outline" size="sm" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Card
                </Button>
            </div>

            <div className="space-y-4">
                {value.map((item, index) => (
                    <div key={item.id || index} className="border p-4 rounded-md space-y-4 bg-card">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className="bg-muted w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                    {index + 1}
                                </span>
                                <Label>Feature Card</Label>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemove(index)} className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Title</Label>
                                <Input
                                    value={item.title}
                                    onChange={e => handleChange(index, 'title', e.target.value)}
                                    placeholder="Feature Title"
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Image</Label>
                                <MediaGallery
                                    images={item.image || []}
                                    onChange={imgs => handleChange(index, 'image', imgs)}
                                    maxImages={1}
                                    label=""
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">Description</Label>
                            <Textarea
                                value={item.description}
                                onChange={e => handleChange(index, 'description', e.target.value)}
                                placeholder="Description text..."
                                rows={2}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
