import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChartLineUp,
  ChatsCircle,
  CheckCircle,
  Code,
  Copy,
  Ear,
  EnvelopeSimple,
  LockSimple,
  PenNib,
  UsersThree,
  Wrench,
} from '@phosphor-icons/react'
import StudioShell, { Emblem } from '../../components/studio/StudioShell.tsx'
import { founders, STUDIO_EMAIL, STUDIO_LOCATION, STUDIO_NAME, type Founder } from '../../data/studio.ts'

const steps = [
  { icon: Ear, title: 'We Listen', text: 'We meet the people who’ll use it, in person when we can, before we design anything.' },
  { icon: PenNib, title: 'We Design', text: 'Sketches, then real screens. You see progress every week and shape it as we go.' },
  { icon: Code, title: 'We Build', text: 'Fast, accessible sites your team can update without calling us.' },
  { icon: ChartLineUp, title: 'Then Measure', text: 'We track what’s working and turn it into reports your board can use.' },
]

const words = ['digital experiences', 'community websites', 'front desks online']

function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), 2600)
    return () => window.clearInterval(t)
  }, [])
  return (
    <span className="st-swap" aria-live="off" key={i} style={{ animation: 'st-in 0.5s ease both' }}>
      {words[i]}
    </span>
  )
}

function FounderCard({ f }: { f: Founder }) {
  const [open, setOpen] = useState(false)
  const id = `bio-${f.initials}`
  return (
    <article className="st-founder reveal">
      <div className="st-founder__top">
        <div className="st-avatar" aria-hidden="true">
          <span>{f.initials}</span>
        </div>
        <div>
          <h3 className="st-founder__name">{f.name}</h3>
          <p className="st-founder__role">{f.role}</p>
        </div>
      </div>
      <div className="st-founder__bio">
        <p>{f.bio[0]}</p>
        <div className={`st-collapse${open ? ' is-open' : ''}`} id={id}>
          <div>
            <p style={{ marginBottom: 16 }}>{f.bio[1]}</p>
            <ul className="st-founder__highlights">
              {f.highlights.map((h) => (
                <li key={h}>
                  <CheckCircle size={16} weight="fill" aria-hidden="true" /> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button type="button" className="st-founder__more" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {open ? 'Show less' : `More about ${f.short}`}
      </button>
      <ul className="st-tags" aria-label={`${f.short}’s skills`}>
        {f.skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </article>
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
            We design clear <RotatingWord />
            <br /> and back them with data.
          </h1>
          <p className="st-lead reveal">
            {STUDIO_NAME} is a two-person studio: a product designer and a data analyst. We help organizations build
            websites people can actually use, and measure whether they work.
          </p>
          <div className="st-hero__actions reveal">
            <Link to="#contact" className="pill pill--dark">
              Contact us
            </Link>
            <Link to="/work" className="pill">
              See our work <ArrowRight size={14} aria-hidden="true" />
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
              <h2 id="featured-title">NICANS: a digital front desk</h2>
              <p>
                A website concept for a Nova Scotia community association, with a newcomer guide, program registration
                and a volunteer dashboard. Designed, then built as a working prototype. Shared privately with permission.
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
            <p className="st-body">
              Two people, one team from start to finish. The person who designs your site helps build it, and the
              person who builds it measures whether it works.
            </p>
          </div>
        </div>
        <div className="st-wide" style={{ maxWidth: 'calc(880px + 2 * var(--gutter))' }}>
          <div className="st-founders">
            {founders.map((f) => (
              <FounderCard key={f.name} f={f} />
            ))}
          </div>
        </div>
      </section>

      <section className="st-section" aria-labelledby="how-title">
        <div className="st-col">
          <div className="st-section__head reveal">
            <Emblem>
              <Wrench size={32} weight="fill" />
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
