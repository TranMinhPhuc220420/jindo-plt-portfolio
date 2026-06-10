import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Container } from './Container'

const navLinks = [
  { label: 'Products', href: '#products' },
  { label: 'Featured', href: '#featured' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-subtle bg-background/70 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/30 text-sm font-bold text-primary">
              P
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              PLT Solutions
            </span>
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
            <ThemeToggle />
            <Button href="#contact" variant="ghost" className="text-sm">
              Get in touch
            </Button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg p-2 text-muted hover:bg-overlay hover:text-foreground"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          'md:hidden border-t border-border-subtle bg-background/95 backdrop-blur-xl overflow-hidden transition-all duration-300',
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
            Get in touch
          </Button>
        </Container>
      </div>
    </header>
  )
}
