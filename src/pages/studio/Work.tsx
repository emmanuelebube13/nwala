import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChatsCircle, Copy, LockSimple, Plus } from '@phosphor-icons/react'
import StudioShell, { Emblem } from '../../components/studio/StudioShell.tsx'
import { useConceptDialog } from '../../components/studio/useConceptDialog.tsx'
import { projects, STUDIO_EMAIL, STUDIO_LOCATION, type Project } from '../../data/studio.ts'

function Tag({ p }: { p: Project }) {
  return (
    <span className={`sw-tag${p.tagStyle ? ` sw-tag--${p.tagStyle}` : ''}`}>
      {p.tagStyle && <LockSimple size={16} aria-hidden="true" />}
      {p.tag}
    </span>
  )
}

function Row({
  p,
  n,
  open,
  onToggle,
  onConcept,
}: {
  p: Project
  n: number
  open: boolean
  onToggle: () => void
  onConcept: (e: MouseEvent) => void
}) {
  const id = `sw-detail-${n}`
  return (
    <li className={`sw-row${open ? ' is-open' : ''}`} style={{ animationDelay: `${n * 50}ms` }}>
      <button type="button" className="sw-row__head" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span className="sw-row__num" aria-hidden="true">
          {String(n + 1).padStart(2, '0')}
        </span>
        <span className="sw-row__main">
          <Tag p={p} />
          <span className="sw-row__title">{p.title}</span>
        </span>
        <span className="sw-row__plus" aria-hidden="true">
          <Plus size={24} />
        </span>
        <span className="sr-only">{open ? ', hide details' : ', show details'}</span>
      </button>
      <div className={`st-collapse${open ? ' is-open' : ''}`} id={id}>
        <div>
          <div className="sw-row__detail">
            <p className="sw-row__desc">{p.description}</p>
            <dl className="st-meta">
              <div>
                <dt>Type</dt>
                <dd>{p.type}</dd>
              </div>
              <div>
                <dt>Credit</dt>
                <dd>{p.credit}</dd>
              </div>
              {p.year && (
                <div>
                  <dt>Year</dt>
                  <dd>{p.year}</dd>
                </div>
              )}
            </dl>
            {p.link &&
              (p.link.internal ? (
                <Link to={p.link.href} className="pill" onClick={onConcept} tabIndex={open ? 0 : -1}>
                  <LockSimple size={16} aria-hidden="true" /> {p.link.label}
                </Link>
              ) : (
                <a className="pill" href={p.link.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                  {p.link.label} <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            {p.note && <p className="st-project__note">{p.note}</p>}
          </div>
        </div>
      </div>
    </li>
  )
}

export default function Work() {
  const [openRow, setOpenRow] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const { onOpen, dialog } = useConceptDialog()

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(STUDIO_EMAIL)
    } catch {
      /* clipboard blocked */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <StudioShell active="work">
      <section className="sw" aria-labelledby="sw-title">
        <div className="st-wide">
          <div className="sw-head reveal">
            <p className="sw-head__years">2023–2026</p>
            <h1 id="sw-title">Selected Work</h1>
          </div>
          <ol className="sw-list">
            {projects.map((p, i) => (
              <Row
                key={p.title}
                p={p}
                n={i}
                open={openRow === i}
                onToggle={() => setOpenRow(openRow === i ? null : i)}
                onConcept={onOpen}
              />
            ))}
          </ol>
        </div>
      </section>

      <section className="st-section sw-contact" aria-labelledby="work-contact" id="contact">
        <div className="st-col">
          <div className="st-section__head reveal" style={{ marginBottom: 24 }}>
            <Emblem>
              <ChatsCircle size={32} weight="fill" />
            </Emblem>
            <h2 id="work-contact" className="st-h2">
              Let’s build your ideas together.
            </h2>
          </div>
          <div className="st-contact__lines reveal">
            <strong>Tell us about your project. We reply within 2 working days.</strong>
            <span>We are based in {STUDIO_LOCATION} and happy to meet in person.</span>
          </div>
          <button type="button" className="pill" onClick={copyEmail} aria-label={`Copy email address ${STUDIO_EMAIL}`}>
            <Copy size={18} aria-hidden="true" /> {STUDIO_EMAIL}
          </button>
        </div>
      </section>
      <div className={`st-toast${copied ? ' is-shown' : ''}`} role="status" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </div>
      {dialog}
    </StudioShell>
  )
}
