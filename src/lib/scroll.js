/* ==========================================================================
   scroll — a single, shared scroll/rAF bus.

   Every scroll-linked animation on the page registers here instead of
   attaching its own listener. One passive listener, one requestAnimationFrame
   per frame, reads batched first then written in a second pass so the browser
   never has to interleave layout reads with style writes.

   Progress conventions
   --------------------
   cover : p = 0 the moment the element's top edge touches the bottom of the
           viewport, p = 1 when its bottom edge leaves the top. Good for
           reveals that should track the element across its whole travel.
   pin   : for a tall wrapper holding a `position: sticky` child. p = 0 the
           frame the child pins to the top of the viewport, p = 1 the frame it
           unpins. This is what drives the odometer, the client mockup and
           every other "scroll through me" moment.
   ========================================================================== */

const targets = new Set()
const frameListeners = new Set()

let queued = false
let attached = false

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Remap p from [a, b] onto a clamped 0..1 ramp. */
export const segment = (p, a, b) => clamp01((p - a) / (b - a || 1))

/** Smooth-start ramp, useful for things that should ease in gently. */
export const smooth = (v) => v * v * (3 - 2 * v)

export const easeOutCubic = (v) => 1 - Math.pow(1 - v, 3)

export const lerp = (a, b, t) => a + (b - a) * t

function measure() {
  queued = false
  if (targets.size === 0 && frameListeners.size === 0) return

  const vh = window.innerHeight || 1
  const y = window.scrollY || window.pageYOffset || 0

  /* pass one — read every geometry, batched */
  const reads = []
  for (const t of targets) reads.push([t, t.el.getBoundingClientRect()])

  /* pass two — write */
  for (let i = 0; i < reads.length; i++) {
    const [t, rect] = reads[i]
    let p

    if (t.mode === 'pin') {
      const span = rect.height - vh
      p = span > 8 ? clamp01(-rect.top / span) : rect.top <= 0 ? 1 : 0
    } else {
      p = clamp01((vh - rect.top) / (vh + rect.height || 1))
    }

    if (p !== t.last || t.vh !== vh) {
      t.last = p
      t.vh = vh
      t.write(p, rect, vh, t.el)
    }
  }

  for (const fn of frameListeners) fn(y, vh)
}

function request() {
  if (queued) return
  queued = true
  requestAnimationFrame(measure)
}

function attach() {
  if (attached) return
  attached = true
  window.addEventListener('scroll', request, { passive: true })
  window.addEventListener('resize', request, { passive: true })
  window.addEventListener('orientationchange', request, { passive: true })
  window.addEventListener('load', request, { once: true })
}

/** Register an element for scroll-progress updates. Returns an unregister fn. */
export function addScrollTarget(el, { mode = 'cover', write }) {
  if (!el || !write) return () => {}
  const t = { el, mode, write, last: -1, vh: -1 }
  targets.add(t)
  attach()
  request()
  return () => {
    targets.delete(t)
  }
}

/** Subscribe to the raw scroll position (used by the nav and page rail). */
export function addFrameListener(fn) {
  frameListeners.add(fn)
  attach()
  request()
  return () => {
    frameListeners.delete(fn)
  }
}

/** Write a set of CSS custom properties onto an element in one go. */
export function setVars(el, vars) {
  for (const k in vars) el.style.setProperty(k, vars[k])
}
