'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { RichEditor } from '@/components/admin/RichEditor'
import { MediaGallery } from '@/components/admin/MediaGallery'

export function DetailsListEditor({ value = [], onChange }) {
    const handleAdd = () => {
        onChange([...value, { id: crypto.randomUUID(), content: '', image: [], swapLayout: false, imageSize: 'medium' }])
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

    const handleMove = (index, direction) => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === value.length - 1) return
        const next = [...value]
        const temp = next[index]
        next[index] = next[index + (direction === 'up' ? -1 : 1)]
        next[index + (direction === 'up' ? -1 : 1)] = temp
        onChange(next)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Label className="text-lg">Details / Swap Sections</Label>
                <Button variant="outline" onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                </Button>
            </div>

            <div className="space-y-8">
                {value.map((item, index) => (
                    <div key={item.id || index} className="border p-6 rounded-lg bg-card space-y-6 shadow-sm">
                        <div className="flex justify-between items-center border-b pb-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </span>
                                <h4 className="font-semibold">Details Block</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                                    <ArrowUp className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'down')} disabled={index === value.length - 1}>
                                    <ArrowDown className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleRemove(index)} className="text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <RichEditor
                                    label="Content"
                                    value={item.content || ''}
                                    onChange={val => handleChange(index, 'content', val)}
                                />
                            </div>

                            <div className="space-y-6">
                                <MediaGallery
                                    label="Image"
                                    images={item.image || []}
                                    onChange={imgs => handleChange(index, 'image', imgs)}
                                    maxImages={1}
                                />

                                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md">
                                    <div className="space-y-2">
                                        <Label>Swap Layout</Label>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={item.swapLayout || false}
                                                onCheckedChange={val => handleChange(index, 'swapLayout', val)}
                                            />
                                            <span className="text-sm text-muted-foreground">{item.swapLayout ? 'Image Left' : 'Image Right'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Image Size</Label>
                                        <select
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={item.imageSize || 'medium'}
                                            onChange={e => handleChange(index, 'imageSize', e.target.value)}
                                        >
                                            <option value="small">Small (30%)</option>
                                            <option value="medium">Medium (50%)</option>
                                            <option value="large">Large (70%)</option>
                                            <option value="full">Full Width (100%)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {value.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                    No Details blocks added. Click "Add Section" to create one.
                </div>
            )}
        </div>
    )
}
