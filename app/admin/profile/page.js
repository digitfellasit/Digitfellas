'use client'

import { useEffect, useState } from 'react'
import { Save, UserCircle, Key, Mail, RefreshCw } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

async function apiCall(url, opts) {
    const res = await fetch(url, {
        ...opts,
        headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.error || `Request failed: ${res.status}`)
    return json
}

export default function ProfilePage() {
    const [user, setUser] = useState({ name: '', email: '' })
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const loadProfile = async () => {
        setLoading(true)
        try {
            const data = await apiCall('/api/auth/me')
            if (data?.user) {
                setUser({
                    name: data.user.name || '',
                    email: data.user.email || ''
                })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load profile: ' + error.message })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (password && password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return
        }

        setSaving(true)
        try {
            const payload = {
                name: user.name,
                email: user.email,
            }
            if (password) payload.password = password

            await apiCall('/api/auth/me', {
                method: 'PUT',
                body: JSON.stringify(payload)
            })

            setMessage({ type: 'success', text: 'Profile updated successfully' })
            setPassword('')
            setConfirmPassword('')
            await loadProfile()
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile: ' + error.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center p-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Profile Settings</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Update your personal information and security settings.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <UserCircle className="h-5 w-5" />
                            Personal Information
                        </h2>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    placeholder="admin@digitfellas.com"
                                    required
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            Security
                        </h2>

                        <p className="text-sm text-muted-foreground mb-6">
                            Leave password fields empty if you don't want to change it.
                        </p>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">New Password</label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Confirm New Password</label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </Card>

                    {message.text && (
                        <div className={`p-4 rounded-lg text-sm ${message.type === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
