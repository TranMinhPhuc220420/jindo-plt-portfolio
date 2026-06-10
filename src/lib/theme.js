export const THEME_STORAGE_KEY = 'plt-theme'

export const THEME_OPTIONS = ['light', 'dark', 'system']

const THEME_COLORS = {
  light: '#F1F3F5',
  dark: '#0B0F19',
}

export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function resolveTheme(preference) {
  if (preference === 'system') return getSystemTheme()
  return preference === 'dark' ? 'dark' : 'light'
}

export function getStoredTheme() {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return THEME_OPTIONS.includes(stored) ? stored : 'system'
}

export function applyTheme(preference) {
  if (typeof document === 'undefined') return resolveTheme(preference)

  const resolved = resolveTheme(preference)
  document.documentElement.classList.toggle('dark', resolved === 'dark')

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', THEME_COLORS[resolved])
  }

  return resolved
}
