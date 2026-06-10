import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle({ className }) {
  const { t } = useTranslation('common')
  const { preference, resolvedTheme, setPreference } = useTheme()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const options = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor },
  ]

  const ResolvedIcon = resolvedTheme === 'dark' ? Moon : Sun

  useEffect(() => {
    if (!open) return undefined

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-2 text-muted transition-colors hover:bg-overlay hover:text-foreground"
        aria-label={t('aria.selectTheme')}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ResolvedIcon size={20} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('aria.themeOptions')}
          className="absolute right-0 top-full z-50 mt-2 min-w-[10.5rem] rounded-xl border border-border bg-surface p-1 shadow-card"
        >
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={preference === value}
              onClick={() => {
                setPreference(value)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                preference === value
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted hover:bg-overlay hover:text-foreground',
              )}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {preference === value && (
                <Check size={14} className="shrink-0 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
