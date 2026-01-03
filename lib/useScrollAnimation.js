import { useEffect, useState, useRef } from 'react'

/**
 * Custom hook for scroll-based animations using Intersection Observer
 * @param {number} threshold - Percentage of element visibility to trigger (0-1)
 * @param {string} rootMargin - Margin around root
 * @returns {object} - { ref, isVisible }
 */
export function useScrollAnimation(threshold = 0.3, rootMargin = '0px') {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Set visibility based on intersection
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold,
                rootMargin
            }
        )

        observer.observe(element)

        // Check if element is already visible on mount
        // This handles elements that are in viewport on page load
        const rect = element.getBoundingClientRect()
        const isInViewport = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
        if (isInViewport) {
            setIsVisible(true)
        }

        // Cleanup
        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [threshold, rootMargin])

    return { ref, isVisible }
}

/**
 * Hook for staggered animations of child elements
 * @param {number} staggerDelay - Delay between each child animation (ms)
 * @returns {object} - { ref, isVisible, getChildDelay }
 */
export function useStaggerAnimation(threshold = 0.3, staggerDelay = 100) {
    const { ref, isVisible } = useScrollAnimation(threshold)

    const getChildDelay = (index) => {
        return isVisible ? index * staggerDelay : 0
    }

    return { ref, isVisible, getChildDelay }
}
