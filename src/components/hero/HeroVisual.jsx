import { motion } from 'framer-motion'
import heroImg from '../../assets/hero.png'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function HeroVisual() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="relative mx-auto w-full max-w-md">
      <motion.div
        className="absolute -inset-4 rounded-lg border border-border bg-surface"
        animate={reduced ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <motion.img
        src={heroImg}
        alt="PLT Solutions brand visual — layered isometric platform"
        className="relative z-10 mx-auto w-48 sm:w-56 md:w-64"
        animate={reduced ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        width={256}
        height={270}
      />
    </div>
  )
}
