import { CELLS, ODO_TEXT } from '../lib/odometer'

/**
 * A purely presentational mechanical counter.
 *
 * Each digit is a vertical wheel of 60 stacked glyphs behind a one-cell
 * window. Each frame writes a single unitless custom property, `--off`, onto
 * each wheel; CSS turns it into a translateY. Six wheels, six property
 * writes, no canvas. The roll runs on a local timer — scrolling has nothing
 * to do with it.
 */
export default function Odometer({ wheelRefs, rolling }) {
  const wheel = (i) => (
    <span className="odo-digit" key={i} style={{ '--j': i }}>
      <span className="odo-cellwrap">
        <span
          className="odo-wheel"
          ref={(node) => {
            wheelRefs.current[i] = node
          }}
        >
          {CELLS.map((c, k) => (
            <span className="odo-glyph" key={k}>
              {c}
            </span>
          ))}
        </span>
      </span>
    </span>
  )

  return (
    <div className={`odo${rolling ? ' is-rolling' : ''}`} aria-hidden="true">
      <span className="sr-only">{ODO_TEXT.replace(',', ' ')}</span>
      <div className="odo-row">
        {wheel(0)}
        {wheel(1)}
        {wheel(2)}
        <span className="odo-digit odo-digit--sep">
          <span className="odo-cellwrap">
            <span className="odo-glyph">,</span>
          </span>
        </span>
        {wheel(3)}
        {wheel(4)}
        {wheel(5)}
      </div>
    </div>
  )
}
