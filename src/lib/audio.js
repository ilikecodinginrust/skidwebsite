/* ==========================================================================
   audio — the site's only functional control.

   Everything is synthesised at runtime with the Web Audio API: no audio
   files, no network requests, nothing sampled. Sound is opt-in and defaults
   to off, so nothing plays unless the visitor asks for it, and the context is
   only created from a real user gesture (browsers block it otherwise).
   ========================================================================== */

const STORAGE_KEY = 'skidclient:sound'

let ctx = null
let bus = null
let noise = null
let enabled = false
const listeners = new Set()

const supported = () =>
  typeof window !== 'undefined' &&
  !!(window.AudioContext || window.webkitAudioContext)

/* A gentle compressor on the master so a fast roll can't clip. */
function ensure() {
  if (ctx || !supported()) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  ctx = new AC()

  bus = ctx.createGain()
  bus.gain.value = 0.5

  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -16
  comp.knee.value = 14
  comp.ratio.value = 6
  comp.attack.value = 0.003
  comp.release.value = 0.2

  bus.connect(comp)
  comp.connect(ctx.destination)
  return ctx
}

function noiseBuffer() {
  if (noise || !ctx) return noise
  const n = Math.floor(ctx.sampleRate * 0.14)
  noise = ctx.createBuffer(1, n, ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n)
  return noise
}

const live = () => enabled && ensure() && ctx.state === 'running'

/* ------------------------------------------------------------------ voices */

/* A mechanical cell click: a short filtered noise knock with a low thock
   underneath, so it reads as a wheel passing a detent rather than a blip. */
export function playTick(intensity = 1) {
  if (!live()) return
  const t = ctx.currentTime
  const level = Math.max(0.05, Math.min(1, intensity))

  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer()

  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1500 + Math.random() * 1100
  bp.Q.value = 1.4

  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.28 * level, t + 0.002)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)

  src.connect(bp)
  bp.connect(g)
  g.connect(bus)
  src.start(t)
  src.stop(t + 0.09)

  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(190 + Math.random() * 60, t)
  osc.frequency.exponentialRampToValueAtTime(120, t + 0.04)

  const og = ctx.createGain()
  og.gain.setValueAtTime(0.0001, t)
  og.gain.exponentialRampToValueAtTime(0.12 * level, t + 0.002)
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)

  osc.connect(og)
  og.connect(bus)
  osc.start(t)
  osc.stop(t + 0.07)
}

/* The jackpot: additive bell partials with a long tail, plus a soft sparkle. */
export function playChime() {
  if (!live()) return
  const t = ctx.currentTime + 0.01

  const partials = [
    [880, 0.2, 1.9],
    [1320, 0.13, 1.4],
    [1760, 0.085, 1.0],
    [2640, 0.045, 0.68],
    [3520, 0.022, 0.45],
  ]

  for (const [freq, amp, dur] of partials) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.997, t + dur)

    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(amp, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)

    osc.connect(g)
    g.connect(bus)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }

  /* a whisper of noise on the attack, so it doesn't sound like a test tone */
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer()
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 3200
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.05, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
  src.connect(hp)
  hp.connect(g)
  g.connect(bus)
  src.start(t)
  src.stop(t + 0.35)
}

/* Confirmation that the control did something. */
export function playBlip(up = true) {
  if (!live()) return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(up ? 420 : 620, t)
  osc.frequency.exponentialRampToValueAtTime(up ? 760 : 320, t + 0.1)

  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)

  osc.connect(g)
  g.connect(bus)
  osc.start(t)
  osc.stop(t + 0.16)
}

/* ------------------------------------------------------------------ state */

export const isEnabled = () => enabled

export function setEnabled(next) {
  enabled = !!next && supported()

  if (enabled) {
    ensure()
    if (ctx && ctx.state === 'suspended') ctx.resume()
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
  } catch {
    /* private mode — the preference just won't survive a reload */
  }

  listeners.forEach((fn) => fn(enabled))
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/* Remember the preference, but never make noise before a gesture: if sound
   was left on, arm a one-shot listener that resumes the context on the first
   interaction. */
export function initAudio() {
  if (!supported()) return

  let remembered = false
  try {
    remembered = window.localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    remembered = false
  }

  if (!remembered) return

  enabled = true
  listeners.forEach((fn) => fn(true))

  const arm = () => {
    ensure()
    if (ctx && ctx.state === 'suspended') ctx.resume()
    window.removeEventListener('pointerdown', arm)
    window.removeEventListener('keydown', arm)
  }
  window.addEventListener('pointerdown', arm, { once: true })
  window.addEventListener('keydown', arm, { once: true })
}
