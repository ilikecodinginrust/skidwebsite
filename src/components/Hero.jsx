import { useCallback, useEffect, useState } from 'react'
import { useInView, usePresence } from '../hooks/useInView'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { segment, setVars } from '../lib/scroll'
import IsoScene from './IsoScene'
import './Hero.css'

/* Decorative telemetry pinned around the composition. Purely for texture —
   nothing here reads or writes real state. Positions are tuned so the labels
   live in the margins of the title block rather than over it. */
const TAGS = [
  { a: 'X 128.400', b: 'Z −256.100', x: '1%', y: '8.6%', i: 0, tier: 1 },
  { a: 'TICK 20.0', b: 'NOMINAL', x: '70%', y: '17.2%', i: 4, tier: 1 },
  { a: 'CHUNK 12 / 12', b: 'LOADED', x: '78%', y: '31%', i: 8, tier: 2 },
  { a: 'ARCHIVE OPEN', b: 'READ / ONLY', x: '78%', y: '56%', i: 10, tier: 3 },
  { a: 'MEM 512 / 1024', b: 'ALLOCATED', x: '1%', y: '74%', i: 6, tier: 2 },
  { a: 'REV 0.1.4-ALPHA', b: '2026.10.18', x: '67%', y: '76%', i: 12, tier: 2 },
]

export default function Hero() {
  const [settled, setSettled] = useState(false)
  const [trackRef, reduced] = useScrollProgress(
    (p, _rect, _vh, el) => {
      const hp = segment(p, 0.48, 0.98)
      setVars(el, {
        '--hp': hp.toFixed(4),
        '--hp-title': (-hp * 7).toFixed(3),
        '--hp-field': (hp * 9).toFixed(3),
        '--hp-grid': (-hp * 2.5).toFixed(3),
        '--hero-fade': (1 - segment(hp, 0.1, 0.92)).toFixed(4),
      })
    },
    { mode: 'cover', rest: 0 },
  )

  const [sectionRef, inView] = useInView({ rootMargin: '0px 0px -8% 0px' })
  /* separate from the reveal flag: continuous animations are switched off the
     moment the hero leaves the viewport so they never run in the background */
  const [liveRef, live] = usePresence()

  const bindRefs = useCallback(
    (node) => {
      trackRef.current = node
      sectionRef.current = node
      liveRef.current = node
    },
    [trackRef, sectionRef, liveRef],
  )

  /* Once the entrance masks have played we can drop the overflow clipping so
     the lime word is free to carry a soft glow. */
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 1750)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="top"
      className={`hero${inView ? ' is-live' : ''}${settled ? ' is-settled' : ''}${
        live ? ' is-present' : ''
      }${reduced ? ' is-static' : ''}`}
      ref={bindRefs}
    >
      {/* ---------- environment ---------- */}
      <div className="hero-field" aria-hidden="true">
        <div className="hero-gridwrap">
          <div className="hero-griddrift">
            <div className="hero-grid hero-grid--fine" />
            <div className="hero-grid hero-grid--bold" />
          </div>
        </div>
        <div className="hero-glow" />
        <div className="hero-scene">
          <IsoScene size={14} />
        </div>
      </div>

      {/* ---------- corner furniture ---------- */}
      <div className="hero-corners" aria-hidden="true">
        <i className="hero-corner hero-corner--tl" />
        <i className="hero-corner hero-corner--tr" />
        <i className="hero-corner hero-corner--bl" />
        <i className="hero-corner hero-corner--br" />
      </div>

      {/* ---------- telemetry ---------- */}
      <div className="hero-tags" aria-hidden="true">
        {TAGS.map((t) => (
          <span
            key={t.a}
            className={`htag htag--t${t.tier}`}
            style={{ '--x': t.x, '--y': t.y, '--i': t.i }}
          >
            <i className="htag-lead" />
            <span className="htag-a mono">{t.a}</span>
            <span className="htag-b mono">{t.b}</span>
          </span>
        ))}
      </div>

      {/* ---------- composition ---------- */}
      <div className="hero-in">
        <div className="hero-eyebrow">
          <i className="hero-eyebrow-mark" />
          <span className="lbl">Minecraft client</span>
          <span className="hero-eyebrow-line" />
          <span className="lbl lbl--dim">Revision 0.1.4 — alpha</span>
          <span className="lbl lbl--acid">Archive open</span>
        </div>

        <h1 className="hero-title display">
          <span className="hero-line">
            <span className="hero-clip">
              <span className="hero-word" style={{ '--i': 0 }}>
                Skid
              </span>
            </span>
            <span className="hero-aside">
              <span className="hero-aside-top mono">
                <i className="hero-aside-dot" />
                EST. NEVER
              </span>
              <span className="hero-aside-hair" />
              <span className="hero-aside-bot mono">
                NO. 999&thinsp;999
                <br />
                FROM THE ARCHIVE
              </span>
            </span>
          </span>

          <span className="hero-line hero-line--2">
            <span className="hero-clip">
              <span className="hero-word hero-word--acid" style={{ '--i': 1 }}>
                Client
              </span>
            </span>
            <span className="hero-measure" aria-hidden="true">
              <i className="hero-measure-tick" style={{ '--k': 0 }} />
              <i className="hero-measure-tick" style={{ '--k': 1 }} />
              <i className="hero-measure-tick" style={{ '--k': 2 }} />
              <i className="hero-measure-tick" style={{ '--k': 3 }} />
              <i className="hero-measure-tick" style={{ '--k': 4 }} />
            </span>
          </span>
        </h1>

        {/* the flexible row that keeps the plate and footer pinned low */}
        <div className="hero-gap" aria-hidden="true" />

        <div className="hero-plate">
          <span className="hero-plate-rule" />
          <blockquote className="hero-tagline">
            <span className="hero-tagline-a">Built from what we stole.</span>
            <span className="hero-tagline-b">Perfected into something else.</span>
          </blockquote>
        </div>

        <div className="hero-foot">
          <span className="hero-scroll" aria-hidden="true">
            <span className="hero-scroll-track">
              <i className="hero-scroll-bead" />
            </span>
            <span className="lbl lbl--micro">Scroll to continue</span>
          </span>

          <span className="hero-legend mono">
            <span>Independent project</span>
            <span className="hero-legend-sep">/</span>
            <span>No affiliation implied</span>
          </span>
        </div>
      </div>
    </section>
  )
}
