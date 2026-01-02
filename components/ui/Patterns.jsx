// SVG Pattern Backgrounds
export function DotPattern({ className = "", width = 20, height = 20, cx = 2, cy = 2, r = 1 }) {
    return (
        <svg className={`absolute inset-0 w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="dot-pattern" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                    <circle cx={cx} cy={cy} r={r} fill="currentColor" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
    )
}

export function GridPattern({ className = "" }) {
    return (
        <svg className={`absolute inset-0 w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
    )
}

export function WavePattern({ className = "" }) {
    return (
        <div className={`absolute inset-0 w-full h-full ${className} opacity-20`} style={{
            backgroundImage: 'repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #2a2a2a55, #2a2a2a55 )',
            backgroundColor: '#0a0a0a'
        }}>
            {/* Conceptual placeholder for complex wave pattern, using CSS radial/linear combo for texture */}
            <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
                <filter id='noiseFilter'>
                    <feTurbulence type='fractalNoise' baseFrequency='0.6' stitchTiles='stitch' />
                </filter>
                <rect width='100%' height='100%' filter='url(#noiseFilter)' opacity='0.05' />
            </svg>
        </div>
    )
}
