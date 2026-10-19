import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { clamp01, segment, setVars } from '../lib/scroll'
import { ARCHIVE_SIZE, COUNT_MS, REST_OFFSETS, WHEELS } from '../lib/odometer'
import Odometer from './Odometer'
import Reveal from './Reveal'
import SectionTag from './SectionTag'
import './SkiddedFrom.css'

/* Fictional archive entries. Invented names for invented clients — this is
   brand lore, not a claim about anyone's code. */
const SOURCES = [
  { name: 'NULLBLOCK', note: 'MOVEMENT SUBROUTINES', status: 'REWRITTEN' },
  { name: null, width: 9, note: 'NAME WITHHELD AT SOURCE', status: 'SEALED' },
  { name: 'PALEHORSE', note: 'HUD PHILOSOPHY', status: 'MERGED' },
  { name: 'CINDERFALL', note: 'CONFIG SCHEMA', status: 'MERGED' },
  { name: 'MERIDIAN', note: 'RENDER ORDER', status: 'PARTIAL' },
  { name: null, width: 6, note: 'REQUESTED REMOVAL', status: 'SEALED' },
  { name: 'GRAVEYARD.SH', note: 'KEYBIND LAYOUT', status: 'REWRITTEN' },
  { name: 'NINE-TAIL', note: 'PACKET LAYER', status: 'DISPUTED' },
  { name: 'OBSIDIAN.TECH', note: 'PANEL GEOMETRY', status: 'MERGED' },
  { name: 'TIMEBOMB', note: 'TELEMETRY — STRIPPED', status: 'PURGED' },
  { name: 'HALFLIFE CORE', note: 'ENTITY PROJECTION', status: 'PARTIAL' },
  { name: null, width: 12, note: 'NO LONGER MAINTAINED', status: 'SEALED' },
]

const pad = (n) => String(n + 1).padStart(3, '0')

const REST_VARS = {
  '--count': '1',
  '--settle': '1',
  '--glow': '0.5',
  '--pa': '1',
  '--pb': '1',
  '--pc': '1',
  '--pd': '1',
}

export default function SkiddedFrom() {
  const wheelRefs = useRef([])
  const rootRef = useRef(null)
  const instrumentRef = useRef(null)
  const rafRef = useRef(0)
  const [phase, setPhase] = useState('idle')

  const reduced = useReducedMotion()

  /* the only scroll linkage left in this section: a gentle parallax on the
     background lattice. The counter itself is driven by a timer. */
  const [trackRef] = useScrollProgress(
    (p, _rect, _vh, el) => {
      el.style.setProperty('--field', ((p - 0.5) * -46).toFixed(2))
    },
    { mode: 'cover', rest: 0.5 },
  )

  const [sectionRef, sectionIn] = useInView({ rootMargin: '0px 0px -6% 0px' })

  const bindRoot = useCallback(
    (node) => {
      trackRef.current = node
      rootRef.current = node
      sectionRef.current = node
    },
    [trackRef, sectionRef],
  )

  const paint = useCallback((t) => {
    for (let i = 0; i < WHEELS.length; i++) {
      const { delay } = WHEELS[i]
      const local = clamp01((t - delay) / (1 - delay))
      /* decelerate into the landing, the way a mechanical counter does */
      const eased = 1 - Math.pow(1 - local, 3.4)
      const node = wheelRefs.current[i]
      if (node) node.style.setProperty('--off', (eased * REST_OFFSETS[i]).toFixed(3))
    }

    const root = rootRef.current
    if (!root) return

    setVars(root, {
      '--count': t.toFixed(4),
      '--settle': segment(t, 0.7, 1).toFixed(4),
      '--glow': (0.2 + Math.sin(Math.PI * clamp01(t)) ** 1.2 * 0.7).toFixed(4),
      '--pa': segment(t, 0.1, 0.45).toFixed(4),
      '--pb': segment(t, 0.2, 0.55).toFixed(4),
      '--pc': segment(t, 0.32, 0.68).toFixed(4),
      '--pd': segment(t, 0.45, 0.8).toFixed(4),
    })
  }, [])

  /* park the instrument at its maximum without any fanfare */
  const park = useCallback(() => {
    paint(1)
    const root = rootRef.current
    if (root) setVars(root, REST_VARS)
  }, [paint])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    paint(0)
    setPhase('idle')
  }, [paint])

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setPhase('counting')

    const started = performance.now()
    const tick = (now) => {
      const t = clamp01((now - started) / COUNT_MS)
      paint(t)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        const root = rootRef.current
        if (root) setVars(root, REST_VARS)
        setPhase('max')
      }
    }

    /* start from zero so the run always reads as a climb to the maximum */
    paint(0)
    rafRef.current = requestAnimationFrame(tick)
  }, [paint])

  /* reduced motion: no run, no flash — just the finished reading */
  useEffect(() => {
    if (reduced) park()
  }, [reduced, park])

  /* start when the instrument is comfortably in view; re-arm once it has left
     the viewport entirely, so the moment can be watched again */
  useEffect(() => {
    const el = instrumentRef.current
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        const ratio = entries[entries.length - 1].intersectionRatio
        if (ratio >= 0.55) run()
        else if (ratio === 0) reset()
      },
      { threshold: [0, 0.25, 0.55, 0.8, 1], rootMargin: '0px 0px -12% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [reduced, run, reset])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <section className="skid" id="skidded">
      <div
        className={`skid-stage${sectionIn ? ' is-live' : ''}${
          phase === 'counting' ? ' is-counting' : ''
        }${phase === 'max' ? ' is-max' : ''}${reduced ? ' is-static' : ''}`}
        ref={bindRoot}
      >
        <div className="skid-field" aria-hidden="true">
          <div className="skid-grid" />
          <div className="skid-glow" />
          <div className="skid-vignette" />
        </div>

        <SectionTag index="02" label="Skidded from" />

        <div className="skid-in">
          <header className="skid-head">
            <span className="skid-eyebrow">
              <i className="skid-eyebrow-dot" />
              <span className="lbl">Archive — source index</span>
              <span className="skid-eyebrow-rule scanline" />
              <span className="lbl lbl--dim">Entry {ARCHIVE_SIZE}</span>
            </span>
            <h2 className="skid-title display">
              <span className="skid-title-a">Our inspiration</span>
              <span className="skid-title-b">is extensive.</span>
            </h2>
          </header>

          <div className="skid-instrument" ref={instrumentRef}>
            {/* the celebration, painted behind the digits */}
            <div className="skid-burst" aria-hidden="true">
              <i className="skid-burst-rays" />
              <i className="skid-burst-core" />
              <i className="skid-burst-ring" />
            </div>

            <div className="skid-rails" aria-hidden="true">
              <span className="skid-line skid-line--tl" />
              <span className="skid-line skid-line--tr" />
              <span className="skid-line skid-line--bl" />
              <span className="skid-line skid-line--br" />
            </div>

            <i className="skid-flash skid-flash--t" aria-hidden="true" />
            <i className="skid-flash skid-flash--b" aria-hidden="true" />

            <span className="skid-tag skid-tag--tl">
              <span className="lbl lbl--micro">Source index</span>
            </span>
            <span className="skid-tag skid-tag--tr">
              <span className="lbl lbl--micro">Archive entry</span>
            </span>

            <i className="skid-cross skid-cross--tl" aria-hidden="true" />
            <i className="skid-cross skid-cross--tr" aria-hidden="true" />
            <i className="skid-cross skid-cross--bl" aria-hidden="true" />
            <i className="skid-cross skid-cross--br" aria-hidden="true" />

            <span className="skid-readout">
              <span className="skid-label skid-label--top">Skidded from</span>
              <Odometer wheelRefs={wheelRefs} rolling={phase === 'counting'} />
              <span className="skid-label skid-label--bottom">Clients</span>
            </span>

            <span className="skid-meter" aria-hidden="true">
              <i className="skid-meter-fill" />
            </span>

            <span className="skid-max" aria-hidden="true">
              Max
            </span>

            <span className="skid-tag skid-tag--bl">
              <span className="lbl lbl--micro">Originality status:</span>
              <span className="lbl lbl--micro lbl--acid">Questionable</span>
            </span>
            <span className="skid-tag skid-tag--br">
              <span className="lbl lbl--micro">Cross-referenced</span>
              <span className="lbl lbl--micro lbl--acid">×{ARCHIVE_SIZE}</span>
            </span>

            <i className="skid-sweep" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ------------- the index itself, in normal flow ------------- */}
      <div className="sources">
        <div className="wrap">
          <div className="sources-head">
            <Reveal className="sources-head-cell">
              <span className="lbl lbl--micro">Index</span>
            </Reveal>
            <Reveal className="sources-head-cell" delay={70}>
              <span className="lbl lbl--micro">Source</span>
            </Reveal>
            <Reveal className="sources-head-cell" delay={140}>
              <span className="lbl lbl--micro">Category</span>
            </Reveal>
            <Reveal className="sources-head-cell sources-head-cell--end" delay={210}>
              <span className="lbl lbl--micro">Status</span>
            </Reveal>
          </div>

          <ol className="sources-list">
            {SOURCES.map((s, i) => (
              <Reveal as="li" className="source" key={i} delay={Math.min(i, 4) * 60}>
                <span className="source-idx mono">{pad(i)}</span>
                <span className="source-name">
                  {s.name ?? (
                    <span
                      className="redacted"
                      style={{ width: `${s.width * 0.62 + 2}ch` }}
                    />
                  )}
                </span>
                <span className="source-note mono">{s.note}</span>
                <span
                  className={`source-status mono${
                    s.status === 'MERGED' ? ' source-status--acid' : ''
                  }`}
                >
                  {s.status}
                </span>
                <span className="source-rule" aria-hidden="true" />
              </Reveal>
            ))}
          </ol>

          <Reveal className="sources-foot" delay={120}>
            <span className="sources-foot-mark" aria-hidden="true" />
            <span className="lbl lbl--micro">
              Independent project. No affiliation implied.
            </span>
            <span className="sources-foot-rule" aria-hidden="true" />
            <span className="lbl lbl--micro lbl--dim">End of index</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
