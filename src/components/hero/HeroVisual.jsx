import { motion } from 'framer-motion'
import heroImg from '../../assets/hero.png'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function HeroVisual() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-3xl" aria-hidden="true" />

      <motion.div
        className="absolute -inset-4 rounded-3xl border border-border bg-overlay-muted backdrop-blur-sm"
        animate={reduced ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <motion.img
        src={heroImg}
        alt="PLT Solutions brand visual — layered isometric platform"
        className="relative z-10 mx-auto w-48 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)] sm:w-56 md:w-64"
        animate={reduced ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        width={256}
        height={270}
      />

      <div
        className="absolute left-1/2 top-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-2xl"
        aria-hidden="true"
      />
    </div>
  )
}
