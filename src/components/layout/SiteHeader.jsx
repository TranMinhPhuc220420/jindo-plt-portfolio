import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import logoImg from '../../assets/hero.png'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Container } from './Container'

export function SiteHeader() {
  const { t } = useTranslation('public')
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: t('nav.products'), href: '#products' },
    { label: t('nav.stack'), href: '#stack' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-subtle bg-surface/95">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center group">
            <img
              src={logoImg}
              alt="PLT SOLUTIONS Logo"
              className="h-8 w-auto"
            />

            <div className="flex flex-col ml-2">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                {t('header.brandName')}
              </span>
              <span className="text-xs tracking-wide text-muted">
                {t('header.tagline')}
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button href="#contact" variant="ghost" className="text-sm">
              {t('header.getInTouch')}
            </Button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg p-2 text-muted hover:bg-overlay hover:text-foreground"
              onClick={() => setOpen(!open)}
              aria-label={open ? t('aria.closeMenu', { ns: 'common' }) : t('aria.openMenu', { ns: 'common' })}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          'md:hidden border-t border-border-subtle bg-surface overflow-hidden transition-all duration-300',
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-overlay hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button href="#contact" variant="ghost" className="mt-2 w-full">
            {t('header.getInTouch')}
          </Button>
        </Container>
      </div>
    </header>
  )
}
