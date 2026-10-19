import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const initial = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY).matches
    : false

/**
 * Tracks `prefers-reduced-motion`. Every scroll-linked component reads this and
 * falls back to a static, resting composition when it is true.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(initial)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(QUERY)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
