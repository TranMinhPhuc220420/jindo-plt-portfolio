import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function GradientOrb({ className }) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      animate={
        reduced
          ? {}
          : {
              scale: [1, 1.08, 1],
              opacity: [0.4, 0.6, 0.4],
            }
      }
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  )
}
