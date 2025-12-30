'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook to fetch hero section data
 * @param {string} pageKey - The page key (e.g., 'home', 'about', 'services')
 */
export function useHero(pageKey = 'home') {
    const [hero, setHero] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchHero = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/hero/${pageKey}`, { cache: 'no-store' })
                if (!res.ok) {
                    // If 404, hero doesn't exist for this page
                    if (res.status === 404) {
                        setHero(null)
                        return
                    }
                    throw new Error('Failed to fetch hero')
                }
                const data = await res.json()
                setHero(data)
            } catch (err) {
                setError(err.message)
                setHero(null)
            } finally {
                setLoading(false)
            }
        }

        fetchHero()
    }, [pageKey])

    return { hero, loading, error }
}

/**
 * Custom hook to fetch services
 */
export function useServices() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/services', { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to fetch services')
                const data = await res.json()
                setServices(Array.isArray(data) ? data : [])
            } catch (err) {
                setError(err.message)
                setServices([])
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [])

    return { services, loading, error }
}

/**
 * Custom hook to fetch a single service by slug
 */
export function useService(slug) {
    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!slug) return

        const fetchService = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/services/${slug}`, { cache: 'no-store' })
                if (!res.ok) throw new Error('Service not found')
                const data = await res.json()
                setService(data)
            } catch (err) {
                setError(err.message)
                setService(null)
            } finally {
                setLoading(false)
            }
        }

        fetchService()
    }, [slug])

    return { service, loading, error }
}

/**
 * Custom hook to fetch projects
 */
export function useProjects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/projects', { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to fetch projects')
                const data = await res.json()
                setProjects(Array.isArray(data) ? data : [])
            } catch (err) {
                setError(err.message)
                setProjects([])
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    return { projects, loading, error }
}

/**
 * Custom hook to fetch a single project by slug
 */
export function useProject(slug) {
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!slug) return

        const fetchProject = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/projects/${slug}`, { cache: 'no-store' })
                if (!res.ok) throw new Error('Project not found')
                const data = await res.json()
                setProject(data)
            } catch (err) {
                setError(err.message)
                setProject(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, [slug])

    return { project, loading, error }
}

/**
 * Custom hook to fetch blog posts
 */
export function useBlog() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/blog', { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to fetch blog posts')
                const data = await res.json()
                setPosts(Array.isArray(data) ? data : [])
            } catch (err) {
                setError(err.message)
                setPosts([])
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [])

    return { posts, loading, error }
}

/**
 * Custom hook to fetch a single blog post by slug
 */
export function useBlogPost(slug) {
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!slug) return

        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/blog/${slug}`, { cache: 'no-store' })
                if (!res.ok) throw new Error('Post not found')
                const data = await res.json()
                setPost(data)
            } catch (err) {
                setError(err.message)
                setPost(null)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    return { post, loading, error }
}

/**
 * Custom hook to fetch navigation items
 */
export function useNavigation() {
    const [navigation, setNavigation] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchNavigation = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/navigation', { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to fetch navigation')
                const data = await res.json()
                setNavigation(Array.isArray(data) ? data : [])
            } catch (err) {
                setError(err.message)
                setNavigation([])
            } finally {
                setLoading(false)
            }
        }

        fetchNavigation()
    }, [])

    return { navigation, loading, error }
}

/**
 * Custom hook to fetch site settings (brand, footer, etc.)
 */
export function useSite() {
    const [site, setSite] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSite = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/site', { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to fetch site')
                const data = await res.json()
                setSite(data)
            } catch (err) {
                setError(err.message)
                setSite(null)
            } finally {
                setLoading(false)
            }
        }

        fetchSite()
    }, [])

    return { site, loading, error }
}
