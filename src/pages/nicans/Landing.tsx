import { useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  AirplaneLanding,
  ArrowUpRight,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Handshake,
  Heart,
  MagnifyingGlass,
  Minus,
  NavigationArrow,
  Plus,
  Timer,
  UsersThree,
  WarningCircle,
  type Icon,
} from '@phosphor-icons/react'
import NicansLayout, { NC } from '../../components/nicans/NicansLayout.tsx'
import { programs } from '../../data/nicans.ts'
import { useReveal } from '../../lib/useReveal.ts'
import './landing.css'

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="ncl-hero" aria-labelledby="ncl-hero-title">
      <div className="ncl-hero__glow ncl-hero__glow--a" aria-hidden="true" />
      <div className="ncl-hero__glow ncl-hero__glow--b" aria-hidden="true" />
      <div className="ncl-hero__inner">
        <p className="ncl-hero__eyebrow">
          <span>Ndi Igbo Cultural Association, Nova Scotia</span>
          <span className="ncl-hero__badge">NICANS</span>
        </p>
        <h1 id="ncl-hero-title" className="ncl-hero__title">
          Your Igbo Community Home in Nova Scotia
        </h1>
        <div className="ncl-hero__actions">
          <Link to={`${NC}/newcomers`} className="nc-btn nc-btn--primary">
            I’m new to Nova Scotia
          </Link>
          <a href="#events" className="nc-btn nc-btn--ghost">
            <span className="nc-studs" aria-hidden="true" />
            See upcoming events
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- Audience cards ---------- */

interface Audience {
  icon: Icon
  title: string
  text: string
  to: string
  img: string
  mirror?: boolean
}

const audiences: Audience[] = [
  {
    icon: AirplaneLanding,
    title: 'I’m new to Nova Scotia',
    text: 'We have a step-by-step help for your first weeks and months.',
    to: `${NC}/newcomers`,
    img: '/assets/nicans/card-newcomer.png',
  },
  {
    icon: UsersThree,
    title: 'I’m a member or family',
    text: 'See our programs, events and membership for all ages.',
    to: `${NC}/register?type=member`,
    img: '/assets/nicans/card-member.png',
  },
  {
    icon: Heart,
    title: 'I want to volunteer',
    text: 'Share your time and skills with the community.',
    to: `${NC}/register?type=volunteer`,
    img: '/assets/nicans/card-volunteer.png',
  },
  {
    icon: Handshake,
    title: 'I represent an organization',
    text: 'Partner with NICANS to serve newcomers.',
    to: `${NC}/register?type=partner`,
    img: '/assets/nicans/card-newcomer.png',
    mirror: true,
  },
]

function HelpSection() {
  const rowRef = useRef<HTMLUListElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const row = rowRef.current
    if (!row) return
    const card = row.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 16 : 300
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section className="ncl-help" id="about" aria-labelledby="ncl-help-title">
      <div className="ncl-band">
        <h2 id="ncl-help-title" className="ncl-band__tab">
          How can we help you today?
        </h2>
      </div>
      <div className="nc-container" id="help">
        <p className="ncl-help__about reveal">
          NICANS brings Igbo families in Nova Scotia together through culture, language and practical support
          for newcomers.
        </p>
        <div className="ncl-cards reveal">
          <ul className="ncl-cards__row" ref={rowRef} aria-label="Ways we can help">
            {audiences.map((a) => {
              const IconCmp = a.icon
              return (
                <li key={a.title} className="ncl-cards__item">
                  <Link to={a.to} className="ncl-card">
                    <span className="ncl-card__top">
                      <span className="ncl-card__icon" aria-hidden="true">
                        <IconCmp size={24} weight="regular" />
                      </span>
                      <ArrowUpRight className="ncl-card__arrow" size={24} aria-hidden="true" />
                    </span>
                    <span className="ncl-card__text">
                      <strong>{a.title}</strong> {a.text}
                    </span>
                    <img
                      className={`ncl-card__img${a.mirror ? ' is-mirrored' : ''}`}
                      src={a.img}
                      alt=""
                      width={341}
                      height={212}
                      loading="lazy"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="ncl-cards__nav">
            <button type="button" className="ncl-cards__btn" onClick={() => scrollBy(-1)}>
              <CaretLeft size={20} aria-hidden="true" />
              <span className="sr-only">Previous cards</span>
            </button>
            <button type="button" className="ncl-cards__btn" onClick={() => scrollBy(1)}>
              <CaretRight size={20} aria-hidden="true" />
              <span className="sr-only">More cards</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Events ---------- */

function EventsSection() {
  const events = programs.slice(0, 3)
  const [selected, setSelected] = useState(events[0]?.slug ?? '')

  return (
    <section className="ncl-events" id="events" aria-labelledby="ncl-events-title">
      <div className="nc-container ncl-events__grid">
        <div className="ncl-events__col reveal">
          <h2 id="ncl-events-title" className="nc-h2 ncl-h2">
            Upcoming Events
          </h2>
          <ul className="ncl-events__list">
            {events.map((p) => (
              <li
                key={p.slug}
                className={`ncl-event${selected === p.slug ? ' is-selected' : ''}`}
                onMouseEnter={() => setSelected(p.slug)}
                onFocus={() => setSelected(p.slug)}
                onClick={() => setSelected(p.slug)}
              >
                <div className="ncl-event__meta">
                  <span>
                    <CalendarBlank size={16} aria-hidden="true" />
                    <span className="sr-only">Date: </span>
                    {p.date}
                  </span>
                  <span>
                    <Timer size={16} aria-hidden="true" />
                    <span className="sr-only">Time: </span>
                    {p.time}
                  </span>
                </div>
                <div className="ncl-event__panel">
                  <h3 className="ncl-event__name">{p.name}</h3>
                  <Link to={`${NC}/register?program=${p.slug}`} className="ncl-event__cta">
                    Sign up now<span className="sr-only"> for {p.name}</span>
                  </Link>
                  <hr className="ncl-event__rule" />
                  <p className="ncl-event__place">
                    <NavigationArrow size={16} aria-hidden="true" />
                    <span className="sr-only">Location: </span>
                    {p.place}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link to={`${NC}/register`} className="nc-btn nc-btn--outline ncl-events__all">
            <span className="nc-studs" aria-hidden="true" />
            See all events
          </Link>
        </div>
        <div className="ncl-posters reveal">
          <img
            src="/assets/nicans/posters.png"
            alt="Posters for the Iri-Ji New Yam Festival and Amara showcase"
            width={760}
            height={635}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */

interface Faq {
  q: string
  a: ReactNode
  plain: string
}

const faqs: Faq[] = [
  {
    q: 'I’ve just arrived. What should I do first?',
    plain:
      'Start with our Your first week checklist: apply for your SIN, apply for your MSI health card, get a phone number and open a bank account. If you’d like help, register as a newcomer and a NICANS volunteer will contact you.',
    a: (
      <>
        Start with our <Link to={`${NC}/newcomers`}>Your first week checklist</Link>: apply for your SIN, apply for
        your MSI health card, get a phone number and open a bank account. If you’d like help, register as a newcomer
        and a NICANS volunteer will contact you.
      </>
    ),
  },
  {
    q: 'How do I find a family doctor?',
    plain:
      'Register with Nova Scotia’s Need a Family Practice Registry by calling 811 or applying online. While you wait, walk-in clinics, pharmacists and virtual care can help. Our volunteers can walk you through it.',
    a: 'Register with Nova Scotia’s Need a Family Practice Registry by calling 811 or applying online. While you wait, walk-in clinics, pharmacists and virtual care can help. Our volunteers can walk you through it.',
  },
  {
    q: 'How do I register for a program or event?',
    plain:
      'Choose an event above and select “Sign up now”. Registration takes about three minutes, and you’ll get a confirmation email and a reminder before the day.',
    a: 'Choose an event above and select “Sign up now”. Registration takes about three minutes, and you’ll get a confirmation email and a reminder before the day.',
  },
  {
    q: 'How can I volunteer?',
    plain:
      'Choose “I want to volunteer” above, tell us what you enjoy doing, and a coordinator will be in touch within a week.',
    a: 'Choose “I want to volunteer” above, tell us what you enjoy doing, and a coordinator will be in touch within a week.',
  },
]

function FaqSection() {
  const baseId = useId()
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return faqs
      .map((f, i) => ({ ...f, i }))
      .filter((f) => !q || f.q.toLowerCase().includes(q) || f.plain.toLowerCase().includes(q))
  }, [query])

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  const searching = query.trim().length > 0

  /** Typing opens every matching answer so the match is visible; clearing restores the first one. */
  const onSearch = (value: string) => {
    setQuery(value)
    const q = value.trim().toLowerCase()
    if (!q) {
      setOpen(new Set([0]))
      return
    }
    setOpen(
      new Set(
        faqs
          .map((f, i) => (f.q.toLowerCase().includes(q) || f.plain.toLowerCase().includes(q) ? i : -1))
          .filter((i) => i >= 0),
      ),
    )
  }

  return (
    <section className="ncl-faq" id="faq" aria-labelledby="ncl-faq-title">
      <div className="nc-container ncl-faq__grid">
        <h2 id="ncl-faq-title" className="nc-h2 ncl-h2 reveal">
          Quick Answers
        </h2>
        <div className="ncl-faq__body reveal">
          <div className="ncl-faq__search">
            <label htmlFor={`${baseId}-search`} className="sr-only">
              Search answers
            </label>
            <MagnifyingGlass size={20} aria-hidden="true" />
            <input
              id={`${baseId}-search`}
              type="search"
              placeholder="Search answers…"
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
          <p className="sr-only" aria-live="polite">
            {searching ? `${visible.length} ${visible.length === 1 ? 'answer' : 'answers'} found` : ''}
          </p>
          {visible.length === 0 ? (
            <div className="ncl-faq__empty">
              <p>
                <strong>No answers match “{query.trim()}”.</strong>
              </p>
              <p>
                Try another word, or <a href="#contact">contact us</a> and a volunteer will help.
              </p>
              <button type="button" className="ncl-faq__clear" onClick={() => onSearch('')}>
                Clear search
              </button>
            </div>
          ) : (
            <ul className="ncl-faq__list">
              {visible.map((f) => {
                const isOpen = open.has(f.i)
                const qId = `${baseId}-q${f.i}`
                const aId = `${baseId}-a${f.i}`
                return (
                  <li key={f.i} className={`ncl-faq__item${isOpen ? ' is-open' : ''}`}>
                    <h3>
                      <button
                        type="button"
                        id={qId}
                        className="ncl-faq__q"
                        aria-expanded={isOpen}
                        aria-controls={aId}
                        onClick={() => toggle(f.i)}
                      >
                        <span>{f.q}</span>
                        {isOpen ? <Minus size={24} aria-hidden="true" /> : <Plus size={24} aria-hidden="true" />}
                      </button>
                    </h3>
                    <div className="ncl-faq__a" id={aId} role="region" aria-labelledby={qId} inert={!isOpen}>
                      <div>
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- Newsletter ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function StayConnected() {
  const baseId = useId()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({})
  const [done, setDone] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const next: typeof errors = {}
    const v = email.trim()
    if (!v) next.email = 'Enter your email address.'
    else if (!EMAIL_RE.test(v)) next.email = 'Enter an email like name@example.com.'
    if (!consent) next.consent = 'Tick the box so we can send you news and reminders.'
    setErrors(next)
    if (next.email) emailRef.current?.focus()
    else if (next.consent) consentRef.current?.focus()
    else setDone(v)
  }

  return (
    <section className="ncl-news" id="news" aria-labelledby="ncl-news-title">
      <div className="nc-container">
        <div className="ncl-news__card reveal">
          <span className="ncl-news__streak ncl-news__streak--a" aria-hidden="true" />
          <span className="ncl-news__streak ncl-news__streak--b" aria-hidden="true" />
          <div className="ncl-news__inner">
            <h2 id="ncl-news-title" className="nc-h2 ncl-news__title">
              Stay Connected
            </h2>
            <p className="ncl-news__lede">Get community news and event reminders.</p>

            <div className="ncl-news__panel">
              {done ? (
                <div className="ncl-news__done" role="status">
                  <CheckCircle size={32} weight="fill" aria-hidden="true" />
                  <div>
                    <p className="ncl-news__done-title">Ndewo! You’re on the list.</p>
                    <p>
                      We’ll send news and event reminders to <strong>{done}</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <form noValidate onSubmit={onSubmit}>
                  <div className="ncl-news__row">
                    <label htmlFor={`${baseId}-email`} className="sr-only">
                      Email address
                    </label>
                    <input
                      ref={emailRef}
                      id={`${baseId}-email`}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="ncl-news__input"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors((er) => ({ ...er, email: undefined }))
                      }}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? `${baseId}-email-err` : undefined}
                    />
                    <button type="submit" className="nc-btn nc-btn--primary ncl-news__submit">
                      Subscribe
                    </button>
                  </div>
                  {errors.email && (
                    <p className="nc-error ncl-news__err" id={`${baseId}-email-err`}>
                      <WarningCircle size={18} weight="fill" aria-hidden="true" />
                      {errors.email}
                    </p>
                  )}
                  <div className="ncl-news__consent">
                    <input
                      ref={consentRef}
                      id={`${baseId}-consent`}
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked)
                        if (errors.consent) setErrors((er) => ({ ...er, consent: undefined }))
                      }}
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={errors.consent ? `${baseId}-consent-err` : undefined}
                    />
                    <label htmlFor={`${baseId}-consent`}>
                      Yes, send me NICANS news and event reminders. I can unsubscribe at any time.
                    </label>
                  </div>
                  {errors.consent && (
                    <p className="nc-error ncl-news__err" id={`${baseId}-consent-err`}>
                      <WarningCircle size={18} weight="fill" aria-hidden="true" />
                      {errors.consent}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="ncl-news__motto">
              <span className="ncl-news__dash" aria-hidden="true" />
              <p className="ncl-news__motto-ig" lang="ig">
                Njiko bu Oganiru
              </p>
              <p className="ncl-news__motto-en">Unity is Progress</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  useReveal()
  return (
    <NicansLayout header="overlay">
      <div className="ncl">
        <Hero />
        <HelpSection />
        <EventsSection />
        <FaqSection />
        <StayConnected />
      </div>
    </NicansLayout>
  )
}
