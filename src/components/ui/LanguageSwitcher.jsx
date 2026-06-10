import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import vietnamIcon from '../../assets/icons/vietnam.png'
import usIcon from '../../assets/icons/united-states.png'
import japanIcon from '../../assets/icons/japan.png'
import { cn } from '../../lib/cn'
import { SUPPORTED_LOCALES } from '../../i18n'

const LANGUAGES = [
  { code: 'vi', icon: vietnamIcon },
  { code: 'en', icon: usIcon },
  { code: 'ja', icon: japanIcon },
]

export function LanguageSwitcher({ className }) {
  const { t, i18n } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const current =
    LANGUAGES.find((lang) => lang.code === i18n.language) ?? LANGUAGES[0]

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
        aria-label={t('aria.selectLanguage')}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={current.icon}
          alt=""
          className="h-5 w-5 rounded-sm object-cover"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('aria.languageOptions')}
          className="absolute right-0 top-full z-50 mt-2 min-w-[10.5rem] rounded-xl border border-border bg-surface p-1 shadow-card"
        >
          {LANGUAGES.filter((lang) => SUPPORTED_LOCALES.includes(lang.code)).map(
            ({ code, icon }) => (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={i18n.language === code}
                onClick={() => {
                  i18n.changeLanguage(code)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  i18n.language === code
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted hover:bg-overlay hover:text-foreground',
                )}
              >
                <img
                  src={icon}
                  alt=""
                  className="h-4 w-4 shrink-0 rounded-sm object-cover"
                />
                <span className="flex-1 text-left">{t(`language.${code}`)}</span>
                {i18n.language === code && (
                  <Check size={14} className="shrink-0 text-primary" />
                )}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
