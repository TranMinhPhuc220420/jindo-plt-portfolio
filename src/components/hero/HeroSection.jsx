import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container } from '../layout/Container'
import { HeroVisual } from './HeroVisual'

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

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
