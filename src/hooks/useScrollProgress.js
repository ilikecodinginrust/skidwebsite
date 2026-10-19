import { useEffect, useRef } from 'react'
import { addScrollTarget } from '../lib/scroll'
import { useReducedMotion } from './useReducedMotion'

/**
 * Binds an element to the shared scroll bus and hands its normalised progress
 * to `write(p, rect, viewportHeight, element)`.
 *
 * When the visitor prefers reduced motion the element is written once with the
 * resting value and never subscribed, so nothing moves.
 *
 * Returns [ref, reduced].
 */
export function useScrollProgress(write, { mode = 'cover', rest = 1 } = {}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const cb = useRef(write)

  /* keep the latest writer available to the bus without re-subscribing it on
     every render */
  useEffect(() => {
    cb.current = write
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      cb.current(rest, el.getBoundingClientRect(), window.innerHeight || 1, el)
      return
    }

    return addScrollTarget(el, {
      mode,
      write: (p, rect, vh, node) => cb.current(p, rect, vh, node),
    })
  }, [mode, reduced, rest])

  return [ref, reduced]
}
