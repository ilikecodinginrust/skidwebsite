import Reveal from './Reveal'
import SectionTag from './SectionTag'
import './Closing.css'

export default function Closing() {
  return (
    <section className="end" id="end">
      <SectionTag index="06" label="Terminus" />

      <div className="wrap end-in">
        <Reveal className="end-eyebrow">
          <i className="end-eyebrow-mark" />
          <span className="lbl">Terminus</span>
          <span className="end-eyebrow-rule" />
          <span className="lbl lbl--dim">Nothing below this line</span>
        </Reveal>

        <Reveal className="end-title display" as="h2" delay={110}>
          <span className="end-sent end-sent--1">Originality is overrated.</span>
          <span className="end-sent end-sent--2">Execution is everything.</span>
        </Reveal>

        <Reveal className="end-rule">
          <i className="end-rule-fill" />
          <i className="end-rule-head" />
        </Reveal>

        <div className="end-sign">
          <Reveal className="end-mark" delay={60}>
            <svg className="end-cube" viewBox="0 0 24 26" aria-hidden="true">
              <path d="M12 1.5 22.5 7.6v11.8L12 25.5 1.5 19.4V7.6z" />
              <path d="M1.5 7.6 12 13.6l10.5-6" />
              <path d="M12 13.6v11.9" />
              <path className="end-cube-acid" d="M12 13.6 22.5 7.6v11.8L12 25.5z" />
            </svg>
            <span className="end-word display">Skidclient</span>
          </Reveal>

          <Reveal className="end-build" delay={170}>
            <span className="end-build-row mono">
              <span className="end-build-k">BUILD</span>
              <span className="end-build-v">0.1.4-alpha+20261018</span>
            </span>
            <span className="end-build-row mono">
              <span className="end-build-k">ARCHIVE</span>
              <span className="end-build-v">999,999 ENTRIES</span>
            </span>
            <span className="end-build-row mono">
              <span className="end-build-k">UPSTREAM</span>
              <span className="end-build-v end-build-v--mute">NOT DISCLOSED</span>
            </span>
          </Reveal>
        </div>
      </div>

      <footer className="foot">
        <div className="wrap foot-in mono">
          <span className="foot-copy">
            © 2026 SKIDCLIENT ARCHIVE<span className="foot-sep">—</span>ALL RIGHTS REVERSED
          </span>
          <span className="foot-mid">
            <span className="foot-dot" />
            v0.1
          </span>
          <span className="foot-end">END OF ARCHIVE</span>
        </div>
      </footer>
    </section>
  )
}
