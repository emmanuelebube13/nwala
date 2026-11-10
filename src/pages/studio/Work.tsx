import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChatsCircle, LockSimple } from '@phosphor-icons/react'
import StudioShell, { Emblem } from '../../components/studio/StudioShell.tsx'
import { projects, STUDIO_EMAIL, STUDIO_LOCATION, type Project, type ProjectCategory } from '../../data/studio.ts'

const filters: Array<'All' | ProjectCategory> = ['All', 'Design', 'Development', 'Data & mapping']

function ProjectRow({ p }: { p: Project }) {
  return (
    <article className={`st-project${p.featured ? ' st-project--featured' : ''}`}>
      {p.featured && (
        <span className="st-project__tab">
          <LockSimple size={12} weight="bold" aria-hidden="true" /> Private concept
        </span>
      )}
      <div className="st-project__main">
        <h2>{p.title}</h2>
        <p>{p.description}</p>
        {p.link &&
          (p.link.internal ? (
            <Link to={p.link.href} className="pill">
              <LockSimple size={16} aria-hidden="true" /> {p.link.label} →
            </Link>
          ) : (
            <a className="st-project__link" href={p.link.href} target="_blank" rel="noopener noreferrer">
              {p.link.label} <ArrowUpRight size={12} style={{ display: 'inline' }} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        {p.note && <p className="st-project__note">{p.note}</p>}
      </div>
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
    </article>
  )
}

export default function Work() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  )

  return (
    <StudioShell active="work">
      <section className="st-work-head">
        <div className="st-col">
          <h1 className="reveal">Work</h1>
          <p className="st-lead reveal">Projects we’ve worked on, together and individually. Each one shows who did what.</p>
        </div>
        <div className="st-filters reveal" role="group" aria-label="Filter projects">
          {filters.map((f) => {
            const count = f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length
            return (
              <button key={f} type="button" className="pill" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f} <small>{count}</small>
              </button>
            )
          })}
        </div>
      </section>

      <section className="st-work-list" aria-label="Projects">
        <div className="st-wide" aria-live="polite">
          {visible.length ? (
            visible.map((p) => <ProjectRow key={`${filter}-${p.title}`} p={p} />)
          ) : (
            <p className="st-empty">No projects in this category yet.</p>
          )}
        </div>
      </section>

      <section className="st-cta" aria-labelledby="work-contact">
        <Emblem>
          <ChatsCircle size={32} weight="fill" />
        </Emblem>
        <div className="st-col" style={{ display: 'grid', gap: 16, textAlign: 'center' }}>
          <h2 id="work-contact" className="st-h2">
            Let’s build something useful
          </h2>
          <p className="st-body">Tell us about your project. We reply within 2 working days.</p>
          <p className="st-body">Based in {STUDIO_LOCATION}. Happy to meet in person.</p>
        </div>
        <a className="pill" href={`mailto:${STUDIO_EMAIL}`}>
          {STUDIO_EMAIL}
        </a>
      </section>
    </StudioShell>
  )
}
