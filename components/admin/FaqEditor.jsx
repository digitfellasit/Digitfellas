'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { RichEditor } from '@/components/admin/RichEditor'
import { Label } from '@/components/ui/label'

export function FaqEditor({ value = [], onChange }) {
    const handleAdd = () => {
        onChange([...value, { question: '', answer: '' }])
    }

    const handleRemove = (index) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const handleChange = (index, field, val) => {
        const updated = [...value]
        updated[index] = { ...updated[index], [field]: val }
        onChange(updated)
    }

    const handleMove = (index, direction) => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === value.length - 1) return

        const updated = [...value]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        const temp = updated[targetIndex]
        updated[targetIndex] = updated[index]
        updated[index] = temp
        onChange(updated)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Frequently Asked Questions</Label>
                <Button onClick={handleAdd} type="button" size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                </Button>
            </div>

            {value.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
                    No FAQs added yet.
                </div>
            )}

            <div className="space-y-4">
                {value.map((item, index) => (
                    <Card key={index} className="p-4 relative group">
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                                <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMove(index, 'down')} disabled={index === value.length - 1}>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleRemove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4 pr-10">
                            <div>
                                <Label className="text-xs mb-1 block">Question</Label>
                                <Input
                                    value={item.question}
                                    onChange={(e) => handleChange(index, 'question', e.target.value)}
                                    placeholder="e.g. How do you handle support?"
                                    className="font-medium"
                                />
                            </div>
                            <div>
                                <Label className="text-xs mb-1 block">Answer</Label>
                                <RichEditor
                                    value={item.answer}
                                    onChange={(val) => handleChange(index, 'answer', val)}
                                    label=""
                                    minHeight="150px"
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
