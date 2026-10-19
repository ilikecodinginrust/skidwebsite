import { useMemo } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { segment, setVars } from '../lib/scroll'
import ClientMockup from './ClientMockup'
import SectionTag from './SectionTag'
import './Showcase.css'

const SIDE_L = [
  ['MODULES.INI', '1 284 LINES'],
  ['CONFIG.DIR', '7 FILES'],
  ['BINDS.JSON', '41 ENTRY'],
  ['THEME.ACID', 'LOCKED'],
]

const SIDE_R = [
  ['UPTIME', '00:14:22'],
  ['EDITS', '1 019'],
  ['REVERTS', '004'],
  ['UPSTREAM', 'UNKNOWN'],
]

export default function Showcase() {
  const [pinRef] = useScrollProgress(
    (p, _rect, _vh, el) => {
      const tilt = segment(p, 0.02, 0.52)
      setVars(el, {
        '--tilt': tilt.toFixed(4),
        '--rx': ((1 - tilt) * 13).toFixed(3),
        '--ry': ((1 - tilt) * -10).toFixed(3),
        '--pop': (0.9 + tilt * 0.1).toFixed(4),
        '--head': segment(p, 0.0, 0.13).toFixed(4),
        '--layers': segment(p, 0.08, 0.36).toFixed(4),
        '--hud': segment(p, 0.3, 0.54).toFixed(4),
        '--sides': segment(p, 0.48, 0.74).toFixed(4),
        '--foot': segment(p, 0.1, 0.3).toFixed(4),
        '--flat': segment(p, 0.6, 0.9).toFixed(4),
        '--exit': segment(p, 0.94, 1).toFixed(4),
        '--field': (-p * 6).toFixed(3),
      })
    },
    { mode: 'pin', rest: 0.85 },
  )

  const sideCards = useMemo(
    () => ({ left: SIDE_L, right: SIDE_R }),
    [],
  )

  return (
    <section className="show" id="client">
      <div className="show-pin-wrap" ref={pinRef}>
        <div className="show-pin">
          <div className="show-field" aria-hidden="true">
            <div className="show-grid" />
            <div className="show-glow" />
            <div className="show-scan" />
          </div>

          <SectionTag index="04" label="The client" />

          <div className="show-in">
            <header className="show-head">
              <span className="show-eyebrow">
                <i className="show-eyebrow-mark" />
                <span className="lbl">Build / interface</span>
                <span className="show-eyebrow-rule" />
                <span className="lbl lbl--dim">Revision 0.1.4 — alpha</span>
              </span>
              <h2 className="show-title display">
                This is the part
                <span className="show-title-b">we actually built.</span>
              </h2>
            </header>

            <div className="show-stage">
              <div className="show-stage-mid">
                <div className="show-side show-side--l" aria-hidden="true">
                  <span className="show-side-head">
                    <i />
                    <span className="lbl lbl--micro">Left wing</span>
                  </span>
                  {sideCards.left.map(([k, v]) => (
                    <span className="show-side-row" key={k}>
                      <span className="show-side-k mono">{k}</span>
                      <span className="show-side-v mono">{v}</span>
                    </span>
                  ))}
                  <span className="show-side-rule" />
                </div>

                <div className="show-window">
                  <span className="show-shadow" aria-hidden="true" />
                  <ClientMockup />
                  <span className="show-stage-glow" aria-hidden="true" />
                </div>

                <div className="show-side show-side--r" aria-hidden="true">
                  <span className="show-side-head">
                    <i />
                    <span className="lbl lbl--micro">Right wing</span>
                  </span>
                  {sideCards.right.map(([k, v]) => (
                    <span className="show-side-row" key={k}>
                      <span className="show-side-k mono">{k}</span>
                      <span className="show-side-v mono">{v}</span>
                    </span>
                  ))}
                  <span className="show-side-rule" />
                </div>
              </div>

              {/* the floating HUD card, on its own parallax plane */}
              <div className="show-hud" aria-hidden="true">
                <span className="show-hud-bar">
                  <i />
                  <span className="lbl lbl--micro">Hud preview</span>
                </span>
                <span className="show-hud-line mono">
                  <span className="show-hud-key">TPS</span>
                  <span className="show-hud-val">20.0</span>
                </span>
                <span className="show-hud-line mono">
                  <span className="show-hud-key">FPS</span>
                  <span className="show-hud-val">240</span>
                </span>
                <span className="show-hud-line mono">
                  <span className="show-hud-key">REACH</span>
                  <span className="show-hud-val">3.00</span>
                </span>
                <span className="show-hud-bars">
                  {[4, 7, 5, 9, 6, 10, 8, 6, 9, 5, 7, 4].map((b, i) => (
                    <i key={i} style={{ '--bh': b }} />
                  ))}
                </span>
              </div>
            </div>

            <div className="show-foot">
              <span className="show-foot-cell">
                <span className="show-foot-k mono">Panels</span>
                <span className="show-foot-v">Modules · Session · Viewport</span>
              </span>
              <span className="show-foot-cell">
                <span className="show-foot-k mono">Theme</span>
                <span className="show-foot-v">Acid / hairline / mono</span>
              </span>
              <span className="show-foot-cell">
                <span className="show-foot-k mono">Function</span>
                <span className="show-foot-v">None — this is a picture</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
