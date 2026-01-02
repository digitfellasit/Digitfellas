'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { RichEditor } from '@/components/admin/RichEditor'
import { MediaGallery } from '@/components/admin/MediaGallery'

export function DetailsEditor({ value = {}, onChange }) {
    const handleChange = (field, val) => {
        onChange({ ...value, [field]: val })
    }

    return (
        <div className="space-y-6 border p-4 rounded-md bg-card">
            <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-medium">Details / Swap Section</h3>
                <div className="flex items-center gap-2">
                    <Switch
                        checked={value.swapLayout || false}
                        onCheckedChange={val => handleChange('swapLayout', val)}
                    />
                    <Label>Swap Layout (Image Left / Text Right)</Label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <RichEditor
                        label="Details Content (Text)"
                        value={value.content || ''}
                        onChange={val => handleChange('content', val)}
                    />
                </div>

                <div>
                    <MediaGallery
                        label="Details Image"
                        images={value.image || []}
                        onChange={imgs => handleChange('image', imgs)}
                        maxImages={1}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                        If no image is provided, the text will act as a full-width block.
                    </p>
                </div>
            </div>
        </div>
    )
}
