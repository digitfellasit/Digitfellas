'use client'

import { useState } from 'react'
import { Upload, X, Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ImageUploader({
    label,
    value = [],
    onChange,
    maxImages = 1,
    supportResponsive = false, // If true, allows desktop/mobile pairs
    hint
}) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (files, type = 'desktop') => {
        if (!files || files.length === 0) return

        setUploading(true)
        try {
            const formData = new FormData()
            Array.from(files).forEach(file => formData.append('files', file))

            const res = await fetch('/api/uploads', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Upload failed')

            const data = await res.json()
            const uploaded = data.uploaded || []

            if (supportResponsive) {
                // Add images with type (desktop/mobile)
                const newImages = uploaded.map(item => ({ url: item.url, type, alt: '' }))
                onChange([...value, ...newImages])
            } else {
                // Simple array of URLs
                const newImages = uploaded.map(item => ({ url: item.url, alt: '' }))
                onChange([...value, ...newImages].slice(0, maxImages))
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload images')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index) => {
        const newValue = [...value]
        newValue.splice(index, 1)
        onChange(newValue)
    }

    const updateAlt = (index, alt) => {
        const newValue = [...value]
        newValue[index] = { ...newValue[index], alt }
        onChange(newValue)
    }

    const desktopImages = supportResponsive ? value.filter(img => img.type === 'desktop') : value
    const mobileImages = supportResponsive ? value.filter(img => img.type === 'mobile') : []

    return (
        <div className="space-y-4">
            {label && <label className="text-sm font-medium">{label}</label>}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

            {supportResponsive ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Desktop Images */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Monitor className="h-4 w-4" />
                            Desktop
                        </div>
                        <div className="space-y-2">
                            {desktopImages.map((img, idx) => (
                                <ImagePreview
                                    key={idx}
                                    image={img}
                                    onRemove={() => removeImage(value.indexOf(img))}
                                    onAltChange={(alt) => updateAlt(value.indexOf(img), alt)}
                                />
                            ))}
                            {(maxImages === -1 || desktopImages.length < maxImages) && (
                                <UploadButton
                                    onUpload={(files) => handleUpload(files, 'desktop')}
                                    uploading={uploading}
                                    label="Upload Desktop"
                                />
                            )}
                        </div>
                    </div>

                    {/* Mobile Images */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Smartphone className="h-4 w-4" />
                            Mobile
                        </div>
                        <div className="space-y-2">
                            {mobileImages.map((img, idx) => (
                                <ImagePreview
                                    key={idx}
                                    image={img}
                                    onRemove={() => removeImage(value.indexOf(img))}
                                    onAltChange={(alt) => updateAlt(value.indexOf(img), alt)}
                                />
                            ))}
                            {(maxImages === -1 || mobileImages.length < maxImages) && (
                                <UploadButton
                                    onUpload={(files) => handleUpload(files, 'mobile')}
                                    uploading={uploading}
                                    label="Upload Mobile"
                                />
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {value.map((img, idx) => (
                        <ImagePreview
                            key={idx}
                            image={img}
                            onRemove={() => removeImage(idx)}
                            onAltChange={(alt) => updateAlt(idx, alt)}
                        />
                    ))}
                    {(maxImages === -1 || value.length < maxImages) && (
                        <UploadButton
                            onUpload={handleUpload}
                            uploading={uploading}
                            label={value.length > 0 ? "Add More" : "Upload Image"}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

function UploadButton({ onUpload, uploading, label }) {
    return (
        <label className={cn(
            "flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            uploading ? "border-muted bg-muted/50 cursor-not-allowed" : "border-border hover:border-primary hover:bg-muted/50"
        )}>
            <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onUpload(e.target.files)}
                disabled={uploading}
            />
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
                {uploading ? 'Uploading...' : label}
            </span>
        </label>
    )
}

function ImagePreview({ image, onRemove, onAltChange }) {
    return (
        <Card className="p-3">
            <div className="flex gap-3">
                <img
                    src={image.url}
                    alt={image.alt || 'Preview'}
                    className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        placeholder="Alt text (optional)"
                        value={image.alt || ''}
                        onChange={(e) => onAltChange(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                    />
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onRemove}
                        className="w-full"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                    </Button>
                </div>
            </div>
        </Card>
    )
}
