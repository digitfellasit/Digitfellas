'use client'

import { LazyMotion, domAnimation } from "framer-motion"

export function FramerMotionProvider({ children }) {
    return (
        <LazyMotion features={domAnimation} strict>
            {children}
        </LazyMotion>
    )
}
