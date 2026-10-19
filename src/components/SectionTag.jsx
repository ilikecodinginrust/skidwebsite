import './SectionTag.css'

/**
 * The rotated index marker that runs down the left edge of every section.
 * Decorative only — it exists to give the page a consistent editorial spine.
 */
export default function SectionTag({ index, label, className = '' }) {
  return (
    <div className={`stag ${className}`.trim()} aria-hidden="true">
      <span className="stag-in">
        <span className="stag-index mono">{index}</span>
        <span className="stag-rule" />
        <span className="stag-label mono">{label}</span>
      </span>
    </div>
  )
}
