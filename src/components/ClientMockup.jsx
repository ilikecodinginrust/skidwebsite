import { useMemo } from 'react'

/* ==========================================================================
   The mock client interface. Every pixel is CSS: no images, no canvas.
   Nothing in here is interactive — the toggles, fields and menus are drawn
   decoration, and none of them carry a listener.
   ========================================================================== */

const CATEGORIES = [
  ['COMBAT', 8, true],
  ['MOVEMENT', 6, false],
  ['RENDER', 7, false],
  ['PLAYER', 4, false],
  ['WORLD', 2, false],
  ['MISC', 0, false],
]

const MODULES = [
  ['KILLAURA', 'RSHIFT', true],
  ['REACH', '—', true],
  ['AUTOCLICKER', 'V', true],
  ['SPRINT', '—', true],
  ['FULLBRIGHT', 'X', true],
  ['ESP', 'B', true],
  ['NAMETAGS', 'N', true],
  ['TRACERS', '—', false],
  ['NOVOID', '—', true],
  ['CHAMS', '—', false],
  ['SCAFFOLD', '—', false],
  ['FASTPLACE', '—', false],
  ['ANTIAFK', '—', false],
  ['STORAGE', 'C', false],
]

const READOUTS = [
  ['TPS', '20.0', 1],
  ['FPS', '240', 0.92],
  ['PING', '12 MS', 0.24],
  ['CHUNKS', '441', 0.7],
  ['MEM', '402 MB', 0.39],
  ['ENTITIES', '128', 0.55],
  ['DROPPED', '0', 0.05],
]

const BARS = [3, 5, 4, 7, 6, 9, 8, 6, 7, 10, 9, 7, 5, 6, 8, 9, 7, 5, 4, 6, 8, 7, 5, 3]

const HOTBAR = [
  { kind: 'sword' },
  { kind: 'block', tone: 'stone' },
  { kind: 'block', tone: 'dirt' },
  { kind: 'block', tone: 'lime' },
  { kind: 'block', tone: 'stone' },
  { kind: 'pick' },
  { kind: 'block', tone: 'dirt' },
  { kind: 'empty' },
  { kind: 'empty' },
]

/* stepped silhouettes — the shape that says "voxel terrain" without a texture */
function terrain(heights, unit, base) {
  let d = `M0 ${base}`
  for (let i = 0; i < heights.length; i++) {
    const y = base - heights[i] * unit
    d += `L${i} ${y}L${i + 1} ${y}`
  }
  return `${d}L${heights.length} ${base}Z`
}

const TERRAIN_H = 15
const NEAR = [2, 2, 3, 4, 4, 5, 6, 6, 5, 4, 3, 3, 4, 5, 4, 3, 2, 2, 3, 4, 4, 3]
const FAR = [3, 4, 5, 5, 6, 6, 7, 7, 6, 5, 6, 7, 7, 6, 5, 4, 4, 5, 6, 5, 4, 3]
const HORIZON = [1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 3, 3, 2, 2, 1, 1, 2, 2, 3, 2, 1, 1]

function Toggle({ on }) {
  return (
    <span className={`mk-toggle${on ? ' is-on' : ''}`}>
      <i />
    </span>
  )
}

function ItemShape({ kind, tone = 'stone' }) {
  if (kind === 'empty') return null
  if (kind === 'block') {
    return <span className={`mk-item mk-item--block mk-item--${tone}`} />
  }
  if (kind === 'sword') {
    return (
      <span className="mk-item mk-item--tool">
        <i className="mk-tool-blade" />
        <i className="mk-tool-grip" />
      </span>
    )
  }
  return (
    <span className="mk-item mk-item--tool">
      <i className="mk-tool-head" />
      <i className="mk-tool-grip" />
    </span>
  )
}

export default function ClientMockup() {
  const nearPath = useMemo(() => terrain(NEAR, 1.72, TERRAIN_H), [])
  const farPath = useMemo(() => terrain(FAR, 1.34, TERRAIN_H), [])
  const horizonPath = useMemo(() => terrain(HORIZON, 0.92, TERRAIN_H), [])

  return (
    <div className="client" role="img" aria-label="Decorative mock of the SkidClient interface">
      {/* ---------------- title bar ---------------- */}
      <div className="client-bar">
        <span className="client-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="client-bar-title mono">
          SKIDCLIENT<span className="client-bar-slash">/</span>MAIN
        </span>
        <span className="client-bar-tabs mono" aria-hidden="true">
          <span className="is-active">MODULES</span>
          <span>CONFIG</span>
          <span>WAYPOINTS</span>
        </span>
        <span className="client-bar-right mono">
          <i className="client-bar-dot" />
          v0.1.4-alpha
        </span>
      </div>

      {/* ---------------- body ---------------- */}
      <div className="client-body">
        {/* category rail */}
        <nav className="client-rail mono" aria-hidden="true">
          <span className="client-rail-head">FILTER</span>
          {CATEGORIES.map(([name, count, on]) => (
            <span className={`client-cat${on ? ' is-active' : ''}`} key={name}>
              <i className="client-cat-bar" />
              <span className="client-cat-name">{name}</span>
              <span className="client-cat-count">{count}</span>
            </span>
          ))}
          <span className="client-rail-foot">
            <span>PROFILES</span>
            <span className="client-rail-foot-v">03</span>
          </span>
        </nav>

        {/* module list */}
        <div className="client-list">
          <div className="client-search mono" aria-hidden="true">
            <i className="client-search-glyph" />
            <span className="client-search-q">esp</span>
            <span className="client-search-caret" />
          </div>

          <div className="client-list-head mono">
            <span>MODULE</span>
            <span>BIND</span>
            <span>ON</span>
          </div>

          <div className="client-modules mono">
            {MODULES.map(([name, bind, on], i) => (
              <span
                className={`client-mod${on ? ' is-on' : ''}`}
                key={name}
                style={{ '--mi': i, '--mod-delay': `${i * 26}ms` }}
              >
                <i className="client-mod-bar" />
                <span className="client-mod-name">{name}</span>
                <span className="client-mod-bind">{bind}</span>
                <Toggle on={on} />
              </span>
            ))}
          </div>
        </div>

        {/* viewport */}
        <div className="client-view">
          <div className="mk-scene" aria-hidden="true">
            <span className="mk-sky" />
            <span className="mk-glowline" />
            <span className="mk-sun" />
            <svg
              className="mk-terrain"
              viewBox={`0 0 22 ${TERRAIN_H}`}
              preserveAspectRatio="none"
            >
              <path className="mk-horizon" d={horizonPath} />
              <path className="mk-far" d={farPath} />
              <path className="mk-near" d={nearPath} />
            </svg>
            <span className="mk-grid" />
            <span className="mk-vignette" />
            <span className="mk-crosshair">
              <i className="mk-cross-h" />
              <i className="mk-cross-v" />
              <i className="mk-cross-dot" />
            </span>

            {/* HUD */}
            <span className="mk-hud mk-hud--tl mono">
              <span>XYZ 128.400 / 64.000 / −256.100</span>
              <span>FACING SOUTH-EAST</span>
            </span>
            <span className="mk-hud mk-hud--tr mono">
              <span className="mk-hud-fps">240 FPS</span>
              <span className="mk-graph">
                {BARS.slice(0, 10).map((b, i) => (
                  <i key={i} style={{ '--bh': b }} />
                ))}
              </span>
            </span>
            <span className="mk-hud mk-hud--bl">
              <span className="mk-vitals mk-vitals--hp">
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} style={{ '--vi': i }} />
                ))}
              </span>
              <span className="mk-vitals mk-vitals--food">
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} style={{ '--vi': i }} />
                ))}
              </span>
            </span>
            <span className="mk-hotbar">
              {HOTBAR.map((h, i) => (
                <span className={`mk-slot${i === 3 ? ' is-active' : ''}`} key={i}>
                  <ItemShape kind={h.kind} tone={h.tone} />
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* inspector */}
        <aside className="client-inspect mono">
          <span className="client-inspect-head">
            <span>SESSION</span>
            <i className="client-inspect-dot" />
          </span>

          <span className="client-chart">
            {BARS.map((b, i) => (
              <i key={i} style={{ '--bh': b, '--bi': i }} />
            ))}
          </span>
          <span className="client-chart-cap">TICK DELTA / 60s</span>

          <span className="client-readouts">
            {READOUTS.map(([k, v, fill]) => (
              <span className="client-read" key={k}>
                <span className="client-read-k">{k}</span>
                <span className="client-read-v">{v}</span>
                <span className="client-read-track">
                  <i style={{ '--fill': fill }} />
                </span>
              </span>
            ))}
          </span>

          <span className="client-inspect-foot">
            <span>SEED</span>
            <span className="client-inspect-seed">0000 0000 0000 0042</span>
          </span>
        </aside>
      </div>

      {/* ---------------- status bar ---------------- */}
      <div className="client-status mono">
        <span className="client-status-l">
          <i className="client-status-dot" />
          CONNECTED<span className="client-status-sep">·</span>play.local:25565
        </span>
        <span className="client-status-r">
          <span>MODULES 14 / 27</span>
          <span className="client-status-sep">·</span>
          <span>BIND RSHIFT</span>
          <span className="client-status-sep">·</span>
          <span className="client-status-acid">0 CLAIMS FILED</span>
        </span>
      </div>
    </div>
  )
}
