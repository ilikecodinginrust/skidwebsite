import { useMemo } from 'react'
import { buildScene } from '../lib/iso'
import './IsoScene.css'

/**
 * The hero's technical environment: an isometric lattice with a block
 * structure resting on it. Drawn in 2D — no 3D rasterisation, no canvas —
 * so it costs nothing to animate.
 */
export default function IsoScene({ className = '', size = 14 }) {
  const scene = useMemo(() => buildScene({ size }), [size])

  return (
    <svg
      className={`iso ${className}`.trim()}
      viewBox={scene.viewBox}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <path className="iso-grid" d={scene.grid} />
      <path className="iso-foot" d={scene.foot} />
      {scene.axes.map((d, i) => (
        <path className="iso-axis" key={`a${i}`} d={d} />
      ))}

      <g className="iso-block">
        {scene.faces.map((f, i) => (
          <path key={i} d={f.d} className={`iso-f iso-f--${f.axis}`} />
        ))}
      </g>

      {/* a single elevated reference point, blinking like a beacon */}
      <g className="iso-beacon">
        <path d={scene.beacon.stem} />
        <circle cx={scene.beacon.head[0]} cy={scene.beacon.head[1]} r="0.22" />
      </g>
    </svg>
  )
}
