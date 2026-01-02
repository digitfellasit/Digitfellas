// Custom hooks for homepage content
import { useQuery } from '@tanstack/react-query'

const API_BASE = '/api/homepage'

export function useClientLogos() {
    return useQuery({
        queryKey: ['client-logos'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}?type=client-logos`)
            if (!res.ok) throw new Error('Failed to fetch client logos')
            return res.json()
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export function useTestimonials() {
    return useQuery({
        queryKey: ['testimonials'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}?type=testimonials`)
            if (!res.ok) throw new Error('Failed to fetch testimonials')
            return res.json()
        },
        staleTime: 5 * 60 * 1000,
    })
}

export function useTechStack() {
    return useQuery({
        queryKey: ['tech-stack'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}?type=tech-stack`)
            if (!res.ok) throw new Error('Failed to fetch tech stack')
            return res.json()
        },
        staleTime: 5 * 60 * 1000,
    })
}

export function useProcessSteps() {
    return useQuery({
        queryKey: ['process-steps'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}?type=process-steps`)
            if (!res.ok) throw new Error('Failed to fetch process steps')
            return res.json()
        },
        staleTime: 5 * 60 * 1000,
    })
}
