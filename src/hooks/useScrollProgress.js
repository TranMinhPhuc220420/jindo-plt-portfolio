import { useEffect, useRef, useState } from 'react'

export function useScrollProgress() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const onScroll = () => {
      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight
      const total = rect.height - viewport
      if (total <= 0) {
        setProgress(0)
        return
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      setProgress(scrolled / total)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ref, progress }
}
