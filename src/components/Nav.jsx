import { useEffect, useRef } from 'react'
import { addFrameListener, clamp01 } from '../lib/scroll'
import './Nav.css'

const RIGHT = ['CLIENT', 'ARCHIVE', 'v0.1']

export default function Nav() {
  const ref = useRef(null)
  const last = useRef(-1)

  useEffect(
    () =>
      addFrameListener((y) => {
        const el = ref.current
        if (!el) return
        const p = clamp01((y - 24) / 110)
        if (p === last.current) return
        last.current = p
        el.style.setProperty('--nav-p', p.toFixed(3))
      }),
    [],
  )

  return (
    <header className="nav" ref={ref}>
      <div className="nav-plate" aria-hidden="true" />

      <div className="nav-in">
        <div className="nav-mark">
          <svg className="nav-cube" viewBox="0 0 24 26" aria-hidden="true">
            <path d="M12 1.5 22.5 7.6v11.8L12 25.5 1.5 19.4V7.6z" />
            <path d="M1.5 7.6 12 13.6l10.5-6" />
            <path d="M12 13.6v11.9" />
          </svg>
          <span className="nav-word">SKIDCLIENT</span>
        </div>

        <div className="nav-right">
          <span className="nav-flag" aria-hidden="true">
            <i className="nav-flag-dot" />
            NET OFF
          </span>
          {RIGHT.map((item) => (
            <span
              className={`nav-item${item === 'v0.1' ? ' nav-item--acid' : ''}${
                item === 'CLIENT' ? ' nav-item--minor' : ''
              }`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="nav-hair" aria-hidden="true" />
    </header>
  )
}
