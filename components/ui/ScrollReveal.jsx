'use client'

import { motion } from 'framer-motion'

export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
}

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6 }
    }
}

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export function ScrollReveal({
    children,
    className = "",
    variant = "fadeUp",
    delay = 0,
    viewport = { once: true, margin: "-50px" }
}) {
    const variants = {
        fadeUp: fadeUp,
        fadeIn: fadeIn,
        stagger: staggerContainer
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={variants[variant]}
            transition={variant !== 'stagger' ? { delay } : undefined}
            className={className}
        >
            {children}
        </motion.div>
    )
}
