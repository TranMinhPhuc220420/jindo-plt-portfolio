import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  THEME_STORAGE_KEY,
} from '../lib/theme'
import { ThemeContext } from './theme-context'

export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(getStoredTheme)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)

  const resolvedTheme = useMemo(() => {
    if (preference === 'system') return systemTheme
    return preference === 'dark' ? 'dark' : 'light'
  }, [preference, systemTheme])

  const setPreference = useCallback((next) => {
    setPreferenceState(next)
    localStorage.setItem(THEME_STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    applyTheme(preference)
  }, [preference, systemTheme])

  useEffect(() => {
    if (preference !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemTheme(getSystemTheme())

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [preference])

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
      isDark: resolvedTheme === 'dark',
      systemTheme,
    }),
    [preference, resolvedTheme, setPreference, systemTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
