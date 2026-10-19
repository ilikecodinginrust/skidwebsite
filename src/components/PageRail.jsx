import { useEffect, useRef } from 'react'
import { addFrameListener } from '../lib/scroll'
import './PageRail.css'

const TICKS = ['01', '02', '03', '04', '05', '06']
const LABELS = [
  'Entry',
  'Skidded from',
  'Principles',
  'The client',
  'Archive',
  'Terminus',
]

/**
 * A hairline index on the right edge: one tick per section plus a lime dot
 * tracking how far through the document the visitor is. Decorative.
 */
export default function PageRail() {
  const ref = useRef(null)
  const last = useRef(-1)
  const active = useRef(-1)

  useEffect(
    () =>
      addFrameListener((y, vh) => {
        const el = ref.current
        if (!el) return
        const doc = document.documentElement
        const max = doc.scrollHeight - vh
        const p = max > 4 ? Math.min(1, Math.max(0, y / max)) : 0
        const rounded = Math.round(p * 1000) / 1000
        if (rounded !== last.current) {
          last.current = rounded
          el.style.setProperty('--rail-p', rounded)
        }

        /* light up the section currently occupying the top third */
        const probe = y + vh * 0.34
        const sections = document.querySelectorAll('main > section')
        let next = 0
        sections.forEach((s, i) => {
          if (s.offsetTop <= probe) next = i
        })
        if (next !== active.current) {
          active.current = next
          const items = el.querySelectorAll('.prail-tick')
          items.forEach((s, i) => s.classList.toggle('is-active', i === next))
        }
      }),
    [],
  )

  return (
    <aside className="prail" ref={ref} aria-hidden="true">
      <span className="prail-track">
        <i className="prail-fill" />
        <i className="prail-dot" />
      </span>
      <ol className="prail-ticks">
        {TICKS.map((t, i) => (
          <li className="prail-tick" key={t}>
            <span className="prail-tick-line" />
            <span className="prail-tick-num">{t}</span>
            <span className="prail-tick-lbl">{LABELS[i]}</span>
          </li>
        ))}
      </ol>
    </aside>
  )
}
