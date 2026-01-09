'use client'

import { useRef, useState } from 'react'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Code, Heading1, Heading2, Loader2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { renderMarkdown } from '@/lib/render-markdown'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function RichEditor({ value = '', onChange, label = 'Content', minHeight = '300px' }) {
    const textareaRef = useRef(null)
    const [preview, setPreview] = useState(false)

    const insertMarkdown = (before, after = '') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = value.substring(start, end)
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

        onChange(newText)

        // Set cursor position
        setTimeout(() => {
            textarea.focus()
            const newPos = start + before.length + selectedText.length
            textarea.setSelectionRange(newPos, newPos)
        }, 0)
    }

    const [uploading, setUploading] = useState(false)

    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [pendingFile, setPendingFile] = useState(null)
    const [altText, setAltText] = useState('')

    const onFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setPendingFile(file)
        setAltText('')
        setImageDialogOpen(true)
    }

    const confirmImageUpload = async () => {
        if (!pendingFile) return

        setUploading(true)
        const formData = new FormData()
        formData.append('files', pendingFile)

        try {
            const res = await fetch('/api/uploads', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || 'Upload failed')
            }

            const data = await res.json()
            const imageUrl = data.uploaded?.[0]?.url

            if (imageUrl) {
                // Save Alt Text
                await fetch('/api/uploads', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: imageUrl, alt: altText })
                }).catch(console.error)

                if (pendingFile.type.startsWith('video/')) {
                    insertMarkdown(`\n<video controls width="100%" class="rounded-lg my-4"><source src="${imageUrl}" type="${pendingFile.type}"></video>\n`)
                } else {
                    insertMarkdown(`![${altText}](${imageUrl})`)
                }
            }
        } catch (error) {
            console.error('Image upload error:', error)
            alert(`Failed to upload image: ${error.message}`)
        } finally {
            setUploading(false)
            setImageDialogOpen(false)
            setPendingFile(null)
        }
    }

    const handleImageUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*,video/*'
        input.style.display = 'none'
        document.body.appendChild(input)

        input.onchange = onFileSelect
        input.click()

        // Cleanup listener is tricky with hidden input created on fly, 
        // but Since we don't reuse it, might be fine. 
        // Better pattern: use a ref to a hidden input in generic return, but this function creation is legacy style.
        // We'll leave the DOM element hanging for a microsecond or remove it after timeout.
        setTimeout(() => document.body.removeChild(input), 1000)
    }



    const [fontOpen, setFontOpen] = useState(false)
    const fonts = [
        { name: 'Default', value: '' },
        { name: 'Manrope', value: 'Manrope, sans-serif' },
        { name: 'Inter', value: 'Inter, sans-serif' },
    ]

    const applyFont = (fontValue) => {
        if (!fontValue) return // Default
        insertMarkdown(`<span style="font-family: ${fontValue}">`, '</span>')
        setFontOpen(false)
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            <Tabs value={preview ? 'preview' : 'edit'} onValueChange={(v) => setPreview(v === 'preview')}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 flex-wrap">
                        {/* Font Picker */}
                        <div className="relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFontOpen(!fontOpen)}
                                title="Select Font"
                                className="h-8 w-auto px-2 font-normal"
                            >
                                <span className="mr-1">Font</span>
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                            {fontOpen && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-popover border rounded-md shadow-lg z-50 py-1">
                                    {fonts.map((f) => (
                                        <button
                                            key={f.name}
                                            type="button"
                                            onClick={() => applyFont(f.value)}
                                            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                                            style={{ fontFamily: f.value }}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="text-border h-4 w-px border-r mx-1" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => insertMarkdown('# ', '')}
                            title="Heading 1"
                        >
                            <Heading1 className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => insertMarkdown('## ', '')}
                            title="Heading 2"
                        >
                            <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => insertMarkdown('**', '**')}
                            title="Bold"
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => insertMarkdown('*', '*')}
                            title="Italic"
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => insertMarkdown('- ', '')}
                            title="Bullet List"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => insertMarkdown('1. ', '')}
                            title="Numbered List"
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => insertMarkdown('[', '](url)')}
                            title="Link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleImageUpload}
                            disabled={uploading}
                            title="Insert Image"
                        >
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => insertMarkdown('`', '`')}
                            title="Code"
                        >
                            <Code className="h-4 w-4" />
                        </Button>
                    </div>

                    <TabsList>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit" className="mt-0">
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Write your content in Markdown..."
                        className="font-mono"
                        style={{ minHeight }}
                    />
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                    <div
                        className="border rounded-lg p-4 prose prose-sm max-w-none"
                        style={{ minHeight }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
                    />
                </TabsContent>
            </Tabs>

            <p className="text-xs text-muted-foreground flex justify-between">
                <span>Supports Markdown & HTML</span>
            </p>

            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Alternative Text (Required for SEO & Accessibility)</Label>
                            <Input
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Describe this image..."
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImageDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmImageUpload} disabled={uploading || !altText.trim()}>
                            {uploading ? 'Uploading...' : 'Insert Image'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
