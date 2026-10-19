import Reveal from './Reveal'
import SectionTag from './SectionTag'
import './Archive.css'

/* Fictional archive rows. Invented codenames for invented sources. */
const ENTRIES = [
  ['SKD-0004', 'NULLBLOCK', 'MOVEMENT', '4.2', 'MERGED', true, 0.86],
  ['SKD-0011', '██████████', 'RENDER', '1.0', 'SEALED', false, 0.12],
  ['SKD-0019', 'PALEHORSE', 'INTERFACE', '2.7', 'MERGED', true, 0.74],
  ['SKD-0023', 'CINDERFALL', 'CONFIG', '3.1', 'REWRITTEN', false, 0.58],
  ['SKD-0034', 'MERIDIAN', 'RENDER', '5.4', 'PARTIAL', false, 0.44],
  ['SKD-0041', 'SKELETON KEY', 'SECURITY', '—', 'DENIED', false, 0.06],
  ['SKD-0056', '██████', 'NETWORK', '2.2', 'SEALED', false, 0.18],
  ['SKD-0062', 'GRAVEYARD.SH', 'INPUT', '1.9', 'REWRITTEN', true, 0.66],
  ['SKD-0073', 'NINE-TAIL', 'NETWORK', '6.0', 'DISPUTED', false, 0.5],
  ['SKD-0081', 'OBSIDIAN.TECH', 'INTERFACE', '3.3', 'MERGED', true, 0.8],
  ['SKD-0094', 'TIMEBOMB', 'TELEMETRY', '0.4', 'PURGED', false, 0.1],
  ['SKD-0102', 'HALFLIFE CORE', 'ENTITY', '2.8', 'PARTIAL', false, 0.38],
  ['SKD-0113', 'LOWTIDE', 'WORLD', '1.4', 'PENDING', false, 0.22],
  ['SKD-4417', '████████████', 'UNKNOWN', '—', 'SEALED', false, 0.02],
]

const HEAD = ['Index', 'Source', 'Category', 'Rev', 'Digest', 'Status']

export default function Archive() {
  return (
    <section className="ar" id="archive">
      <SectionTag index="05" label="Source archive" />

      <div className="wrap ar-in">
        <header className="ar-head">
          <Reveal className="ar-lede">
            <span className="ar-eyebrow">
              <i className="ar-eyebrow-mark" />
              <span className="lbl">Internal database — read only</span>
            </span>
            <h2 className="ar-title display">
              The archive
              <span className="ar-title-b">of everything borrowed.</span>
            </h2>
          </Reveal>

          <Reveal className="ar-counter" delay={140}>
            <span className="ar-counter-num mono">999,999</span>
            <span className="ar-counter-lbl lbl lbl--micro">Entries indexed</span>
            <span className="ar-counter-rule" />
            <span className="ar-counter-meta mono">LAST REVISION 2026.10.18 · 04:12 UTC</span>
          </Reveal>
        </header>

        <div className="ar-table">
          <div className="ar-row ar-row--head">
            {HEAD.map((h, i) => (
              <span
                className={`ar-th mono${i >= 3 ? ' ar-num' : ''}`}
                key={h}
              >
                {h}
              </span>
            ))}
          </div>

          <ol className="ar-body">
            {ENTRIES.map(([id, source, cat, rev, status, primary, digest], i) => {
              const redacted = source.startsWith('█')
              return (
                <Reveal
                  as="li"
                  className={`ar-row${primary ? ' ar-row--primary' : ''}`}
                  key={id}
                  delay={Math.min(i, 6) * 55}
                >
                  <span className="ar-id mono">
                    <i className="ar-id-tick" />
                    {id}
                  </span>
                  <span className={`ar-source${redacted ? ' ar-source--redacted' : ''}`}>
                    {redacted ? (
                      <span
                        className="redacted"
                        style={{ width: `${source.length * 0.66}ch` }}
                      />
                    ) : (
                      source
                    )}
                  </span>
                  <span className="ar-cat mono">{cat}</span>
                  <span className="ar-num mono ar-rev">{rev}</span>
                  <span className="ar-num ar-digest">
                    <i style={{ '--w': digest }} />
                  </span>
                  <span
                    className={`ar-num ar-status mono${
                      status === 'MERGED' ? ' ar-status--acid' : ''
                    }${status === 'SEALED' ? ' ar-status--dim' : ''}`}
                  >
                    {status}
                  </span>
                </Reveal>
              )
            })}
          </ol>
        </div>

        <Reveal className="ar-foot" delay={80}>
          <span className="ar-foot-mark" aria-hidden="true" />
          <p className="ar-foot-p">
            The line between inspiration and reinvention is under investigation.
          </p>
          <span className="ar-foot-rule" aria-hidden="true" />
          <span className="ar-foot-meta mono">12 of 999,999 shown</span>
        </Reveal>
      </div>
    </section>
  )
}
