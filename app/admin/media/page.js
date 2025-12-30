'use client'

import { useEffect, useState } from 'react'
import { Upload, Trash2, Edit } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

async function apiCall(url, options = {}) {
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } })
    if (!res.ok) throw new Error((await res.json().catch(() => ({ error: 'Request failed' }))).error || `HTTP ${res.status}`)
    return res.json()
}

export default function MediaLibraryPage() {
    const [media, setMedia] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [editDialog, setEditDialog] = useState(false)
    const [editingMedia, setEditingMedia] = useState(null)
    const [editForm, setEditForm] = useState({ alt_text: '', caption: '' })

    const loadMedia = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/media')
            setMedia(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load media:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadMedia() }, [])

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setUploading(true)
        try {
            const formData = new FormData()
            files.forEach(file => formData.append('files', file))

            const res = await fetch('/api/uploads', { method: 'POST', body: formData })
            if (!res.ok) throw new Error('Upload failed')

            await loadMedia()
            e.target.value = ''
        } catch (error) {
            alert('Failed to upload: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleEdit = (item) => {
        setEditingMedia(item)
        setEditForm({ alt_text: item.alt_text || '', caption: item.caption || '' })
        setEditDialog(true)
    }

    const handleSaveEdit = async () => {
        try {
            await apiCall(`/api/media/${editingMedia.id}`, {
                method: 'PUT',
                body: JSON.stringify(editForm)
            })
            setEditDialog(false)
            await loadMedia()
        } catch (error) {
            alert('Failed to update: ' + error.message)
        }
    }

    const handleDelete = async (item) => {
        if (!confirm('Delete this media file?')) return
        try {
            await apiCall(`/api/media/${item.id}`, { method: 'DELETE' })
            await loadMedia()
        } catch (error) {
            alert('Failed to delete: ' + error.message)
        }
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A'
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Media Library</h1>
                        <p className="text-muted-foreground mt-1">Manage your uploaded files</p>
                    </div>
                    <div>
                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleUpload}
                            className="hidden"
                        />
                        <Button asChild disabled={uploading}>
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="h-4 w-4 mr-2" />
                                {uploading ? 'Uploading...' : 'Upload Files'}
                            </label>
                        </Button>
                    </div>
                </div>

                <Card className="p-6">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading media...</div>
                    ) : media.length === 0 ? (
                        <div className="text-center py-16">
                            <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">No media files yet</p>
                            <Button asChild>
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Your First File
                                </label>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {media.map((item) => (
                                <div key={item.id} className="group relative">
                                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                                        {item.mime_type?.startsWith('image/') ? (
                                            <img
                                                src={item.url}
                                                alt={item.alt_text || item.filename}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Upload className="h-12 w-12" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                        <Button size="icon" variant="secondary" onClick={() => handleEdit(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDelete(item)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-2 text-xs">
                                        <p className="font-medium truncate">{item.filename}</p>
                                        <p className="text-muted-foreground">{formatFileSize(item.size_bytes)}</p>
                                        {item.width && item.height && (
                                            <p className="text-muted-foreground">{item.width} × {item.height}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit Media</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        {editingMedia && (
                            <>
                                <div className="aspect-video rounded-lg overflow-hidden border bg-muted mb-4">
                                    <img
                                        src={editingMedia.url}
                                        alt={editingMedia.alt_text || editingMedia.filename}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <Label>Alt Text</Label>
                                    <Input
                                        value={editForm.alt_text}
                                        onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                                        placeholder="Describe this image"
                                    />
                                </div>
                                <div>
                                    <Label>Caption</Label>
                                    <Input
                                        value={editForm.caption}
                                        onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                                        placeholder="Optional caption"
                                    />
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p><strong>Filename:</strong> {editingMedia.filename}</p>
                                    <p><strong>URL:</strong> {editingMedia.url}</p>
                                    <p><strong>Size:</strong> {formatFileSize(editingMedia.size_bytes)}</p>
                                    {editingMedia.uploaded_by_email && (
                                        <p><strong>Uploaded by:</strong> {editingMedia.uploaded_by_email}</p>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancel</Button>
                            <Button onClick={handleSaveEdit}>Save Changes</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
