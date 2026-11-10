import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BezierCurve,
  ChartLineUp,
  ChatsCircle,
  Copy,
  Desktop,
  EnvelopeSimple,
  LockSimple,
  Path,
  Target,
  UsersThree,
} from '@phosphor-icons/react'
import StudioShell, { Emblem } from '../../components/studio/StudioShell.tsx'
import { founders, STUDIO_EMAIL, STUDIO_LOCATION, STUDIO_NAME, type Founder } from '../../data/studio.ts'

const steps = [
  { icon: Target, title: 'We Listen', text: 'We meet the people who’ll use it, in person when we can, before we design anything.' },
  { icon: BezierCurve, title: 'We Design', text: 'Sketches, then real screens. You see progress every week and shape it as we go.' },
  { icon: Desktop, title: 'We Build', text: 'Fast, accessible sites your team can update without calling us.' },
  { icon: ChartLineUp, title: 'Then Measure', text: 'We track what’s working and turn it into reports your board can use.' },
]

function Portrait({ f, active, onSelect }: { f: Founder; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      className={`st-portrait${active ? ' is-active' : ''}`}
      aria-pressed={active}
      aria-controls={`bio-${f.initials}`}
      onClick={onSelect}
    >
      {f.photo ? (
        <img src={f.photo} alt={`Portrait of ${f.name}`} loading="lazy" />
      ) : (
        /* Image placeholder: replace by setting `photo` for this founder in src/data/studio.ts */
        <div className="st-photo-placeholder" role="img" aria-label={`Portrait of ${f.name} (photo coming soon)`} />
      )}
      <span className="st-portrait__label">
        <strong>{f.name}</strong>
        <span>{f.role}</span>
      </span>
    </button>
  )
}

/** Founders band from the final Figma frame: two portraits with short bios either side, full bios below. */
function Founders() {
  const [active, setActive] = useState<number | null>(null)
  const [a, b] = founders
  return (
    <>
      <div className="st-band reveal">
        <p className="st-band__note st-band__note--left">{a.summary}</p>
        <div className="st-band__portraits">
          <Portrait f={a} active={active === 0} onSelect={() => setActive(active === 0 ? null : 0)} />
          <Portrait f={b} active={active === 1} onSelect={() => setActive(active === 1 ? null : 1)} />
        </div>
        <p className="st-band__note st-band__note--right">{b.summary}</p>
      </div>
      <div className="st-col st-bios">
        {founders.map((f, i) => (
          <div
            key={f.name}
            id={`bio-${f.initials}`}
            className={`st-bio reveal${active !== null && active !== i ? ' is-dim' : ''}`}
          >
            <p>
              <strong>{f.name}</strong>, {f.role.toLowerCase()}. {f.bio[0]}
            </p>
            <p>{f.bio[1]}</p>
            <ul className="st-tags" aria-label={`${f.short}’s skills`}>
              {f.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

export default function Home() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(STUDIO_EMAIL)
    } catch {
      /* clipboard blocked: the toast still confirms what to copy */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <StudioShell active="studio">
      <section className="st-hero">
        <div className="st-col">
          <h1 className="reveal">
            We design clear
            <br /> digital experiences and
            <br /> back them with data.
          </h1>
          <p className="st-lead reveal">
            {STUDIO_NAME} is a two-person studio: a product designer and a data analyst. We help organizations build
            websites people can actually use, and measure whether they work.
          </p>
          <div className="st-hero__actions reveal">
            <Link to="#contact" className="pill pill--dark">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="st-folder-wrap" aria-labelledby="featured-title">
        <div className="st-col">
          <Link to="/work/nicans" className="st-folder reveal">
            <span className="st-folder__back" aria-hidden="true" />
            <span className="st-folder__paper" aria-hidden="true">
              <img src="/assets/studio/concept-peek.jpg" alt="" width={720} height={550} loading="lazy" />
            </span>
            <div className="st-folder__front">
              <span className="st-folder__tab">Featured concept</span>
              <h2 id="featured-title">NICANS: A digital front desk</h2>
              <p>
                A website concept for a Nova Scotia community association, with a newcomer guide, program registration
                and a volunteer dashboard. Shared privately with permission.
              </p>
              <span className="pill">
                <LockSimple size={16} aria-hidden="true" /> View the concept
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="st-section" aria-labelledby="founders-title" id="about">
        <div className="st-col">
          <div className="st-section__head reveal">
            <Emblem>
              <UsersThree size={32} weight="fill" />
            </Emblem>
            <h2 id="founders-title" className="st-h2">
              Meet the founders
            </h2>
          </div>
        </div>
        <div className="st-wide">
          <Founders />
        </div>
      </section>

      <section className="st-section" aria-labelledby="how-title">
        <div className="st-col">
          <div className="st-section__head reveal">
            <Emblem>
              <Path size={32} weight="bold" />
            </Emblem>
            <h2 id="how-title" className="st-h2">
              How we work
            </h2>
          </div>
          <ol className="st-steps" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="st-step reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="st-step__num">
                  <Icon size={24} aria-hidden="true" />
                  <span>0{i + 1}</span>
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="st-section" aria-labelledby="contact-title" id="contact">
        <div className="st-col">
          <div className="st-section__head reveal" style={{ marginBottom: 24 }}>
            <Emblem>
              <ChatsCircle size={32} weight="fill" />
            </Emblem>
            <h2 id="contact-title" className="st-h2">
              Let’s build your ideas together.
            </h2>
          </div>
          <div className="st-contact__lines reveal">
            <strong>Tell us about your project. We reply within 2 working days.</strong>
            <span>We are based in {STUDIO_LOCATION} and happy to meet in person.</span>
          </div>
          <div className="st-contact__actions reveal">
            <button type="button" className="pill" onClick={copyEmail} aria-label={`Copy email address ${STUDIO_EMAIL}`}>
              <Copy size={18} aria-hidden="true" /> {STUDIO_EMAIL}
            </button>
            <a className="pill pill--dark" href={`mailto:${STUDIO_EMAIL}`}>
              <EnvelopeSimple size={16} aria-hidden="true" /> Email us
            </a>
          </div>
        </div>
      </section>

      <div className={`st-toast${copied ? ' is-shown' : ''}`} role="status" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </div>
    </StudioShell>
  )
}
