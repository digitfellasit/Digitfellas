'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function ExperienceSectionPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const { register, control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            title: '',
            description_1: '',
            description_2: '',
            years_count: '',
            years_label: '',
            image_url: '',
            image_alt: '',
            principles: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "principles"
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/home-sections/experience')
            if (!res.ok) throw new Error('Failed to fetch data')
            const data = await res.json()

            // Format principles if they come as simple array of strings, fieldArray expects objects
            // Actually our schema stores it as JSONB, so it comes back as array of strings typically if we just JSON.stringify'd the array of strings
            // But useFieldArray needs objects with 'id' usually, but for simple strings we can just map to { val: string }
            // Let's assume the API returns the exact JSON we stored.
            // If we stored ["A", "B"], we need to convert to [{value: "A"}, {value: "B"}] for the form, and back on save.

            const formattedPrinciples = (data.principles || []).map(p => ({ value: p }))

            reset({
                ...data,
                principles: formattedPrinciples
            })
        } catch (error) {
            console.error(error)
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data) => {
        setSaving(true)
        try {
            // Convert principles back to simple array of strings
            const cleanData = {
                ...data,
                principles: data.principles.map(p => p.value)
            }

            const res = await fetch('/api/home-sections/experience', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData)
            })

            if (!res.ok) throw new Error('Failed to save')

            const updated = await res.json()
            // Reset with formatted principles again to keep fieldArray happy
            reset({
                ...updated,
                principles: (updated.principles || []).map(p => ({ value: p }))
            })

            toast.success('Section updated successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to save changes')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Experience Section</h1>
                    <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Content */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Text Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input {...register('title')} placeholder="Experience Shapes Our Approach" />
                                </div>

                                <div className="space-y-2">
                                    <Label>First Paragraph</Label>
                                    <Textarea {...register('description_1')} className="h-24" placeholder="Description part 1" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Second Paragraph</Label>
                                    <Textarea {...register('description_2')} className="h-24" placeholder="Description part 2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Key Principles</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <Input
                                            {...register(`principles.${index}.value`)}
                                            placeholder="Enter a principle"
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => append({ value: '' })} className="w-full">
                                    <Plus className="mr-2 h-4 w-4" /> Add Principle
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Visuals */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Visual Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Years Count</Label>
                                        <Input {...register('years_count')} placeholder="20+" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Years Label</Label>
                                        <Input {...register('years_label')} placeholder="Years of Experience" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Main Image</Label>
                                    <ImageUploader
                                        value={watch('image_url') ? [{ url: watch('image_url'), alt: watch('image_alt') || '' }] : []}
                                        onChange={(images) => {
                                            const img = images[0] || {}
                                            setValue('image_url', img.url || '')
                                            setValue('image_alt', img.alt || '')
                                        }}
                                        maxImages={1}
                                        className="aspect-[3/4] w-full"
                                    />
                                    <p className="text-xs text-muted-foreground">Portrait image recommended.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
