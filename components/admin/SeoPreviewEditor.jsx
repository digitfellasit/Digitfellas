'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Globe } from 'lucide-react'

export function SeoPreviewEditor({
    title = '',
    slug = '',
    metaTitle = '',
    metaDescription = '',
    onMetaTitleChange,
    onMetaDescriptionChange,
    baseUrl = 'https://digitfellas.com',
    pathPrefix = ''
}) {
    const [charCounts, setCharCounts] = useState({ title: 0, description: 0 })

    const displayTitle = metaTitle || title || 'Untitled'
    const displayDescription = metaDescription || 'No description provided'
    const displayUrl = `${baseUrl}${pathPrefix}/${slug || 'page-slug'}`

    useEffect(() => {
        setCharCounts({
            title: metaTitle.length,
            description: metaDescription.length
        })
    }, [metaTitle, metaDescription])

    const getTitleColor = () => {
        if (charCounts.title === 0) return 'text-muted-foreground'
        if (charCounts.title > 60) return 'text-destructive'
        if (charCounts.title > 50) return 'text-yellow-600'
        return 'text-green-600'
    }

    const getDescriptionColor = () => {
        if (charCounts.description === 0) return 'text-muted-foreground'
        if (charCounts.description > 160) return 'text-destructive'
        if (charCounts.description > 140) return 'text-yellow-600'
        return 'text-green-600'
    }

    return (
        <Card className="p-4 space-y-4">
            <h3 className="font-medium border-b pb-2">SEO Settings</h3>

            {/* Google SERP Preview */}
            <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Globe className="h-3 w-3" />
                    <span className="uppercase tracking-wider font-medium">Search Engine Preview</span>
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm text-green-700 dark:text-green-500 font-normal">
                            {baseUrl.replace('https://', '')}
                        </span>
                        <span className="text-xs text-muted-foreground">›</span>
                        <span className="text-xs text-muted-foreground truncate">
                            {pathPrefix.replace('/', '')}{slug ? ` › ${slug}` : ' › page-slug'}
                        </span>
                    </div>

                    <h4 className="text-xl text-blue-600 dark:text-blue-400 font-normal leading-tight line-clamp-1 hover:underline cursor-pointer">
                        {displayTitle}
                    </h4>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {displayDescription}
                    </p>
                </div>
            </div>

            {/* Meta Title Input */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <Label>Meta Title</Label>
                    <span className={`text-xs font-medium ${getTitleColor()}`}>
                        {charCounts.title} / 60
                    </span>
                </div>
                <Input
                    value={metaTitle}
                    onChange={(e) => onMetaTitleChange(e.target.value)}
                    placeholder={title || "Enter SEO title (50-60 characters recommended)"}
                    maxLength={70}
                />
                <p className="text-xs text-muted-foreground mt-1">
                    {!metaTitle && 'Will use page title if empty'}
                </p>
            </div>

            {/* Meta Description Input */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <Label>Meta Description</Label>
                    <span className={`text-xs font-medium ${getDescriptionColor()}`}>
                        {charCounts.description} / 160
                    </span>
                </div>
                <Textarea
                    value={metaDescription}
                    onChange={(e) => onMetaDescriptionChange(e.target.value)}
                    rows={3}
                    placeholder="Enter SEO description (140-160 characters recommended)"
                    maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Optimal length: 140-160 characters
                </p>
            </div>

            {/* URL Preview */}
            <div className="pt-2 border-t">
                <Label className="text-xs text-muted-foreground">Full URL</Label>
                <div className="mt-1 px-3 py-2 bg-muted rounded-md">
                    <code className="text-xs break-all">{displayUrl}</code>
                </div>
            </div>
        </Card>
    )
}
