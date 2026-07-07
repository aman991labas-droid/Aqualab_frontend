'use client'

import { motion } from 'framer-motion'

/* Page transition wrapper */
export function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    )
}

/* Fade-up on scroll */
export function FadeUp({ children, delay = 0, className = '' }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    )
}

/* Fade-in on scroll */
export function FadeIn({ children, delay = 0, className = '' }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}

/* Slide in from left */
export function SlideInLeft({ children, delay = 0, className = '' }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    )
}

/* Slide in from right */
export function SlideInRight({ children, delay = 0, className = '' }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    )
}

/* Stagger children */
export function StaggerContainer({ children, className = '' }) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
            }}
        >
            {children}
        </motion.div>
    )
}

/* Stagger child item */
export function StaggerItem({ children, className = '' }) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
            }}
        >
            {children}
        </motion.div>
    )
}
