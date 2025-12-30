'use client'

import { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function MediaGallery({
    images = [],
    onChange,
    maxImages = -1,
    variant = 'desktop',
    label = 'Images'
}) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setUploading(true)
        try {
            const formData = new FormData()
            files.forEach((file) => formData.append('files', file))
            formData.append('variant', variant)

            const res = await fetch('/api/uploads', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || 'Upload failed')
            }

            const data = await res.json()
            const newImages = data.uploaded || []

            if (maxImages === 1) {
                onChange(newImages)
            } else if (maxImages > 0) {
                onChange([...images, ...newImages].slice(0, maxImages))
            } else {
                onChange([...images, ...newImages])
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert(`Failed to upload images: ${error.message}`)
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleRemove = (index) => {
        onChange(images.filter((_, i) => i !== index))
    }

    const handleAltChange = (index, alt) => {
        const updated = [...images]
        updated[index] = { ...updated[index], alt }
        onChange(updated)
    }

    const canAddMore = maxImages === -1 || images.length < maxImages

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{label}</label>
                {canAddMore && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={maxImages !== 1}
                onChange={handleFileSelect}
                className="hidden"
            />

            {images.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                        No images uploaded yet
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Images
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="group relative">
                            <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                                <img
                                    src={image.url}
                                    alt={image.alt || `Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemove(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <Input
                                placeholder="Alt text"
                                value={image.alt || ''}
                                onChange={(e) => handleAltChange(index, e.target.value)}
                                className="mt-2 text-xs"
                            />
                        </div>
                    ))}
                </div>
            )}

            {maxImages > 0 && (
                <p className="text-xs text-muted-foreground">
                    {images.length} / {maxImages} images uploaded
                </p>
            )}
        </div>
    )
}
