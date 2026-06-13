import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_FOOTER_SETTINGS, mapFooterFromDb } from '../lib/footerMapper'

export function useFooterSettings() {
  const [settings, setSettings] = useState(DEFAULT_FOOTER_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchSettings() {
      const { data, error: fetchError } = await supabase
        .from('footer_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle()

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      setSettings(mapFooterFromDb(data) ?? DEFAULT_FOOTER_SETTINGS)
      setLoading(false)
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}
