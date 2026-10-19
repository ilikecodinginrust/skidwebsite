import { useInView } from '../hooks/useInView'
import Reveal from './Reveal'
import SectionTag from './SectionTag'
import './Philosophy.css'

/* The statement is broken by hand rather than by the browser so the
   composition is identical everywhere. */
const LINES = [
  ['Why', 'build'],
  ['from', 'scratch'],
  ['when', 'the', 'internet'],
  ['already', 'did', 'it?'],
]

/* pre-flattened word order drives the stagger */
let k = 0
const INDEXED = LINES.map((line) =>
  line.map((word) => ({ word, i: k++ })),
)

const PRINCIPLES = [
  {
    n: '01',
    title: 'Borrowed genius',
    body: 'The best ideas rarely exist in isolation. Somebody, somewhere, already had it — and then had to go to bed.',
    meta: 'ADOPTED',
    indent: 0,
  },
  {
    n: '02',
    title: 'Rebuilt differently',
    body: 'Familiar ideas, a distinct implementation. Same instinct, different hands, no shared commits.',
    meta: 'REWRITTEN',
    indent: 1,
  },
  {
    n: '03',
    title: 'Questionable originality',
    body: 'At least we are honest about it. This is the entire marketing department.',
    meta: 'ACKNOWLEDGED',
    indent: 2,
  },
]

export default function Philosophy() {
  const [titleRef, titleIn] = useInView({ rootMargin: '0px 0px -18% 0px' })

  return (
    <section className="ph" id="principles">
      <SectionTag index="03" label="Principles" />

      <div className="wrap ph-in">
        <div className="ph-lede">
          <Reveal className="ph-eyebrow" delay={0}>
            <i className="ph-eyebrow-mark" />
            <span className="lbl">Interior — philosophy</span>
          </Reveal>

          <h2
            className={`ph-title display${titleIn ? ' is-on' : ''}`}
            ref={titleRef}
          >
            {INDEXED.map((line, li) => (
              <span className={`ph-line ph-line--${li + 1}`} key={li}>
                {line.map(({ word, i }) => (
                  <span className="ph-w" key={word} style={{ '--i': i }}>
                    <span className="ph-w-i">{word}</span>
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <div className="ph-note">
            <Reveal className="ph-rule" delay={80} />
            <Reveal className="ph-note-body" delay={200}>
              <p className="ph-note-p">
                Nothing here is a claim about where anything came from. It is a
                description of how it was rebuilt.
              </p>
              <span className="ph-note-meta mono">
                <span>FILE 03 / PRINCIPLES</span>
                <span className="ph-note-sep">·</span>
                <span>LAST TOUCH 2026.10.18</span>
              </span>
            </Reveal>
          </div>
        </div>

        <div className="ph-map">
          <div className="ph-map-grid" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <ol className="ph-list">
            {PRINCIPLES.map((p, i) => (
              <Reveal
                as="li"
                className="ph-item"
                key={p.n}
                delay={i * 110}
                style={{ '--row': i }}
              >
                <span className="ph-item-num mono">{p.n}</span>
                <span className="ph-item-title">{p.title}</span>
                <span className="ph-item-body">{p.body}</span>
                <span className="ph-item-meta mono">{p.meta}</span>
                <span className="ph-item-bar" aria-hidden="true" />
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
