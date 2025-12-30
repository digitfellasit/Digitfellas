'use client'

import { useRef, useState } from 'react'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Code, Heading1, Heading2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { renderMarkdown } from '@/lib/render-markdown'

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

    const handleImageUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*,video/*'
        input.style.display = 'none' // Hidden
        document.body.appendChild(input) // Append to body for safety

        input.onchange = async (e) => {
            const file = e.target.files?.[0]
            if (!file) {
                document.body.removeChild(input)
                return
            }

            setUploading(true)
            const formData = new FormData()
            formData.append('files', file)

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
                    if (file.type.startsWith('video/')) {
                        insertMarkdown(`\n<video controls width="100%" class="rounded-lg my-4"><source src="${imageUrl}" type="${file.type}"></video>\n`)
                    } else {
                        insertMarkdown(`![Image](${imageUrl})`)
                    }
                } else {
                    throw new Error('No image URL returned')
                }
            } catch (error) {
                console.error('Image upload error:', error)
                alert(`Failed to upload image: ${error.message}`)
            } finally {
                setUploading(false)
                document.body.removeChild(input)
            }
        }
        input.click()
    }



    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            <Tabs value={preview ? 'preview' : 'edit'} onValueChange={(v) => setPreview(v === 'preview')}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 flex-wrap">
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

            <p className="text-xs text-muted-foreground">
                Supports Markdown formatting
            </p>
        </div>
    )
}
