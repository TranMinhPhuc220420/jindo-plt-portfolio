import { lazy, Suspense, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container } from '../layout/Container'
import { HeroVisual } from './HeroVisual'

const HeroCanvas = lazy(() =>
  import('./HeroCanvas').then((module) => ({ default: module.HeroCanvas })),
)

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function HeroSection() {
  const { t } = useTranslation('public')
  const pointerRef = useRef({ x: 0, y: 0 })

  const handlePointerMove = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    }
  }, [])

  return (
    <section
      className="relative min-h-[520px] overflow-hidden pt-28 pb-20 md:min-h-[600px] md:pt-36 md:pb-28"
      onPointerMove={handlePointerMove}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 [mask-image:linear-gradient(to_right,transparent_0%,transparent_38%,rgba(0,0,0,0.25)_52%,black_68%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,transparent_38%,rgba(0,0,0,0.25)_52%,black_68%)]"
        aria-hidden="true"
      >
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center lg:justify-end lg:pr-16">
              <HeroVisual />
            </div>
          }
        >
          <HeroCanvas pointerRef={pointerRef} />
        </Suspense>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full max-w-3xl bg-gradient-to-r from-background from-55% via-background/70 to-transparent"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="pointer-events-auto text-center lg:text-left">
            <motion.p
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="eyebrow mb-6"
            >
              {t('hero.eyebrow')}
            </motion.p>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-display text-foreground sm:text-5xl md:text-6xl"
            >
              {t('hero.title')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 max-w-xl text-muted sm:text-lg lg:mx-0 mx-auto"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Button href="#products">
                {t('hero.viewProducts')}
                <ArrowRight size={16} />
              </Button>
              <Button href="#contact" variant="ghost">
                {t('hero.contactUs')}
              </Button>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex items-center justify-center gap-8 lg:justify-start text-sm text-muted"
            >
              <div>
                <span className="block text-2xl font-semibold text-foreground">6+</span>
                {t('hero.productsShipped')}
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="block text-2xl font-semibold text-foreground">12+</span>
                {t('hero.technologies')}
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </Container>
    </section>
  )
}
