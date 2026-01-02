// Star Rating Component
import { Star } from 'lucide-react'

export function StarRating({ rating = 5, size = 16 }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-${size / 4} h-${size / 4}`}
                    fill={i < rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                />
            ))}
        </div>
    )
}
