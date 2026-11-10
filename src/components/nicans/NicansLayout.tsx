import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'
import './nicans.css'

export const NC = '/concept/nicans'

const demoLinks = [
  { to: NC, label: 'Home', end: true },
  { to: `${NC}/newcomers`, label: 'Newcomer guide' },
  { to: `${NC}/register`, label: 'Registration' },
  { to: `${NC}/dashboard`, label: 'Management hub' },
]

function DemoBar() {
  return (
    <div className="nc-demobar" role="region" aria-label="Concept demo navigation">
      <div className="nc-container nc-demobar__inner">
        <span className="nc-demobar__label">
          <span className="nc-demobar__dot" aria-hidden="true" />
          <span className="nc-demobar__text">Live concept by Nwala</span>
        </span>
        <nav aria-label="Demo screens">
          {demoLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/work/nicans" className="nc-demobar__back">
          ← <span className="nc-demobar__text">Back to </span>case study
        </Link>
      </div>
    </div>
  )
}

const navLinks = [
  { to: `${NC}#about`, label: 'About' },
  { to: `${NC}/newcomers`, label: 'New to Nova Scotia' },
  { to: `${NC}#events`, label: 'Programs & Events' },
  { to: `${NC}/register`, label: 'Get Involved' },
  { to: `${NC}#faq`, label: 'FAQ' },
  { to: `${NC}#contact`, label: 'Contact us' },
]

function Header({ variant }: { variant: 'overlay' | 'solid' }) {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  useEffect(() => setOpen(false), [pathname, hash])

  return (
    <header className={`nc-header nc-header--${variant}`}>
      <div className="nc-container nc-header__inner">
        <Link to={NC} className="nc-brand">
          <img src="/assets/nicans/logo.png" alt="" width={28} height={28} />
          NICANS
        </Link>
        <button
          type="button"
          className="nc-menu-btn"
          aria-expanded={open}
          aria-controls="nc-primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
        <nav id="nc-primary-nav" className={`nc-nav${open ? ' is-open' : ''}`} aria-label="Main">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="nc-nav__link"
              aria-current={l.to === pathname ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link to={`${NC}#contact`} className="nc-btn nc-btn--ghost">
            <span className="nc-studs" aria-hidden="true" />
            Donate
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="nc-footer" id="contact">
      <div className="nc-container">
        <div className="nc-footer__grid">
          <div className="nc-footer__about">
            <p className="nc-footer__name">Ndi Igbo Cultural Association, Nova Scotia</p>
            <p>Fostering a strong sense of unity and solidarity within the Igbo community in Nova Scotia.</p>
          </div>
          <div className="nc-footer__cols">
            <div>
              <h3>Explore</h3>
              <ul>
                <li><Link to={`${NC}#about`}>About</Link></li>
                <li><Link to={`${NC}#events`}>Programs</Link></li>
                <li><Link to={`${NC}#events`}>Events</Link></li>
                <li><Link to={NC}>Gallery</Link></li>
                <li><Link to={NC}>News</Link></li>
              </ul>
            </div>
            <div>
              <h3>Get help</h3>
              <ul>
                <li><Link to={`${NC}/newcomers`}>New to Nova Scotia</Link></li>
                <li><Link to={`${NC}/newcomers`}>Find a Service</Link></li>
                <li><Link to={`${NC}#faq`}>FAQ</Link></li>
                <li><Link to={`${NC}#contact`}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3>Get involved</h3>
              <ul>
                <li><Link to={`${NC}/register`}>Volunteer</Link></li>
                <li><Link to={`${NC}/register`}>Membership</Link></li>
                <li><Link to={`${NC}#contact`}>Donate</Link></li>
                <li><Link to={`${NC}#contact`}>Partner with us</Link></li>
              </ul>
            </div>
            <div>
              <h3>Contact us</h3>
              <ul>
                <li><a className="nc-footer__mail" href="mailto:info@ndigbons.ca">info@ndigbons.ca</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="nc-footer__legal">
          <p>© 2027 NICANS · Concept design by Nwala</p>
          <p>
            <Link to={NC}>Privacy policy</Link> · <Link to={NC}>Accessibility</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

/** Shell for every NICANS concept screen: demo bar, header, page, footer. */
export default function NicansLayout({
  children,
  header = 'solid',
  footer = true,
}: {
  children: ReactNode
  header?: 'overlay' | 'solid' | 'none'
  footer?: boolean
}) {
  return (
    <div className="nc">
      <a className="skip-link" href="#nc-main">Skip to content</a>
      <DemoBar />
      <div style={{ position: 'relative' }}>
        {header !== 'none' && <Header variant={header} />}
        <main id="nc-main">{children}</main>
      </div>
      {footer && <Footer />}
    </div>
  )
}
