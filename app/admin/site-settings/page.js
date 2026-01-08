'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

async function apiCall(url, options = {}) {
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } })
    if (!res.ok) throw new Error((await res.json().catch(() => ({ error: 'Request failed' }))).error || `HTTP ${res.status}`)
    return res.json()
}

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState({
        brand_name: '',
        brand_tagline: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        social_facebook: '',
        social_twitter: '',
        social_linkedin: '',
        social_instagram: '',
        social_whatsapp: '',
        footer_text: '',
        seo_default_title: '',
        seo_default_description: '',
        analytics_id: '',
        head_scripts: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const loadSettings = async () => {
        setLoading(true)
        try {
            const site = await apiCall('/api/site')
            setSettings({
                brand_name: site?.brand?.name || '',
                brand_tagline: site?.footer?.tagline || '',
                contact_email: site?.footer?.contact?.email || '',
                contact_phone: site?.footer?.contact?.phone || '',
                contact_address: site?.footer?.contact?.address || '',
                social_facebook: site?.footer?.socials?.find(s => s.label === 'Facebook')?.href || '',
                social_twitter: site?.footer?.socials?.find(s => s.label === 'Twitter')?.href || '',
                social_linkedin: site?.footer?.socials?.find(s => s.label === 'LinkedIn')?.href || '',
                social_instagram: site?.footer?.socials?.find(s => s.label === 'Instagram')?.href || '',
                social_whatsapp: site?.footer?.socials?.find(s => s.label === 'WhatsApp')?.href || '',
                footer_text: site?.footer?.copyright || '',
                seo_default_title: site?.brand?.name || '',
                seo_default_description: site?.footer?.tagline || '',
                analytics_id: site?.analytics_id || '',
                head_scripts: site?.head_scripts || '',
            })
        } catch (error) {
            console.error('Failed to load settings:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadSettings() }, [])

    const handleSave = async () => {
        setSaving(true)
        setMessage('')
        try {
            // Fetch current site data
            const site = await apiCall('/api/site')

            // Update with new values
            const updatedSite = {
                ...site,
                brand: {
                    ...site?.brand,
                    name: settings.brand_name
                },
                footer: {
                    ...site?.footer,
                    tagline: settings.brand_tagline,
                    copyright: settings.footer_text,
                    contact: {
                        email: settings.contact_email,
                        phone: settings.contact_phone,
                        address: settings.contact_address
                    },
                    socials: [
                        { id: 'fb', label: 'Facebook', href: settings.social_facebook },
                        { id: 'tw', label: 'Twitter', href: settings.social_twitter },
                        { id: 'li', label: 'LinkedIn', href: settings.social_linkedin },
                        { id: 'ig', label: 'Instagram', href: settings.social_instagram },
                        { id: 'wa', label: 'WhatsApp', href: settings.social_whatsapp },
                    ].filter(s => s.href) // Only include socials with URLs
                },
                analytics_id: settings.analytics_id,
                head_scripts: settings.head_scripts
            }

            await apiCall('/api/site', { method: 'PUT', body: JSON.stringify(updatedSite) })
            setMessage('Settings saved successfully!')
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setMessage('Failed to save: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="text-center py-12 text-muted-foreground">Loading settings...</div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Site Settings</h1>
                        <p className="text-muted-foreground mt-1">Configure your website settings</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>

                {message && (
                    <Card className={`p-4 ${message.includes('success') ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
                        {message}
                    </Card>
                )}

                <Tabs defaultValue="brand" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="brand">Brand</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="social">Social Media</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="brand">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Brand Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Brand Name *</Label>
                                    <Input value={settings.brand_name} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} placeholder="Your Company Name" />
                                </div>
                                <div>
                                    <Label>Tagline</Label>
                                    <Input value={settings.brand_tagline} onChange={(e) => setSettings({ ...settings, brand_tagline: e.target.value })} placeholder="Your company tagline" />
                                </div>
                                <div>
                                    <Label>Footer Text</Label>
                                    <Textarea value={settings.footer_text} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} rows={3} placeholder="Copyright text and additional footer information" />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Email *</Label>
                                    <Input type="email" value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} placeholder="info@example.com" />
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <Input value={settings.contact_phone} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} placeholder="+1 234 567 8900" />
                                </div>
                                <div>
                                    <Label>Address</Label>
                                    <Textarea value={settings.contact_address} onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })} rows={3} placeholder="Your business address" />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Social Media Links</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Facebook</Label>
                                    <Input value={settings.social_facebook} onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })} placeholder="https://facebook.com/yourpage" />
                                </div>
                                <div>
                                    <Label>Twitter / X</Label>
                                    <Input value={settings.social_twitter} onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })} placeholder="https://twitter.com/yourhandle" />
                                </div>
                                <div>
                                    <Label>LinkedIn</Label>
                                    <Input value={settings.social_linkedin} onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })} placeholder="https://linkedin.com/company/yourcompany" />
                                </div>
                                <div>
                                    <Label>Instagram</Label>
                                    <Input value={settings.social_instagram} onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })} placeholder="https://instagram.com/yourhandle" />
                                </div>
                                <div>
                                    <Label>WhatsApp</Label>
                                    <Input value={settings.social_whatsapp} onChange={(e) => setSettings({ ...settings, social_whatsapp: e.target.value })} placeholder="https://wa.me/yournumber" />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seo">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">SEO Defaults</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Default Meta Title</Label>
                                    <Input value={settings.seo_default_title} onChange={(e) => setSettings({ ...settings, seo_default_title: e.target.value })} placeholder="Your Company - Tagline" />
                                    <p className="text-xs text-muted-foreground mt-1">Used when page doesn't have a custom title</p>
                                </div>
                                <div>
                                    <Label>Default Meta Description</Label>
                                    <Textarea value={settings.seo_default_description} onChange={(e) => setSettings({ ...settings, seo_default_description: e.target.value })} rows={3} placeholder="Default description for your website" />
                                    <p className="text-xs text-muted-foreground mt-1">Used when page doesn't have a custom description</p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="advanced">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Advanced Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Google Analytics ID</Label>
                                    <Input value={settings.analytics_id} onChange={(e) => setSettings({ ...settings, analytics_id: e.target.value })} placeholder="G-XXXXXXXXXX" />
                                    <p className="text-xs text-muted-foreground mt-1">Google Analytics measurement ID</p>
                                </div>
                                <div className="pt-4 border-t">
                                    <Label>Custom Head Scripts</Label>
                                    <Textarea
                                        value={settings.head_scripts}
                                        onChange={(e) => setSettings({ ...settings, head_scripts: e.target.value })}
                                        rows={10}
                                        className="font-mono text-sm"
                                        placeholder="<script>...</script>&#10;<meta ... />&#10;<link ... />"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Added to the &lt;head&gt; tag of every page. Use for SEO, analytics, or custom meta tags.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    )
}
