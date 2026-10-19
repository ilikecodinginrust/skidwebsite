import { useEffect, useRef, useState } from 'react'

/**
 * Reveal-on-enter via IntersectionObserver.
 *
 * `inView` flips true as soon as any part of the element crosses the trigger
 * line, and flips back to false once the element has fully dropped below the
 * viewport again. That means a reveal replays when the visitor scrolls back
 * down to it, while never flickering mid-screen on the way up.
 *
 * Elements taller than the viewport only ever reveal — they never un-reveal,
 * because their top edge is already above the fold before the exit condition.
 */
export function useInView({
  threshold = 0,
  rootMargin = '0px 0px -14% 0px',
  replay = true,
} = {}) {
  const ref = useRef(null)
  /* without IntersectionObserver there is nothing to observe — start revealed */
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (entry.isIntersecting) {
          setInView(true)
        } else if (replay && entry.boundingClientRect.top > 0) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, replay])

  return [ref, inView]
}

/**
 * Same mechanism, opposite intent: this one flips back to false the moment the
 * element leaves the viewport. Use it to gate continuous CSS animations so
 * off-screen sections stop costing anything.
 */
export function usePresence({ rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [present, setPresent] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => setPresent(entries[entries.length - 1].isIntersecting),
      { rootMargin },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return [ref, present]
}
