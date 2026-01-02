// Custom hooks for homepage content
import { useQuery } from '@tanstack/react-query'

const API_BASE = '/api/homepage'

export function useHomepageData() {
    return useQuery({
        queryKey: ['homepage-data'],
        queryFn: async () => {
            const res = await fetch('/api/homepage-all')
            if (!res.ok) throw new Error('Failed to fetch homepage data')
            return res.json()
        },
        staleTime: 5 * 60 * 1000,
    })
}

export function useClientLogos() {
    const { data, isLoading } = useHomepageData()
    return { data: data?.clientLogos || [], isLoading }
}

export function useTestimonials() {
    const { data, isLoading } = useHomepageData()
    return { data: data?.testimonials || [], isLoading }
}

export function useTechStack() {
    const { data, isLoading } = useHomepageData()
    return { data: data?.techStack || [], isLoading }
}

export function useProcessSteps() {
    const { data, isLoading } = useHomepageData()
    return { data: data?.processSteps || [], isLoading }
}
