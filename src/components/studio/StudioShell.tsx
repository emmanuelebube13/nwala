import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { STUDIO_LOCATION, STUDIO_NAME } from '../../data/studio.ts'
import { useReveal } from '../../lib/useReveal.ts'
import './studio.css'

/** Floating pill navigation from the Figma studio frames. */
function StudioNav({ active }: { active: 'studio' | 'work' }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`st-nav${scrolled ? ' is-scrolled' : ''}`}>
      <nav className="st-nav__pill" aria-label="Main">
        <Link to="/" className="st-nav__logo" aria-label={`${STUDIO_NAME}, home`}>
          {STUDIO_NAME}
        </Link>
        <div className="st-nav__links">
          <Link to="/" className="st-nav__link" aria-current={active === 'studio' ? 'page' : undefined}>
            Studio
          </Link>
          <Link to="/work" className="st-nav__link" aria-current={active === 'work' ? 'page' : undefined}>
            Work
          </Link>
          <Link to="/#contact" className="st-nav__link st-nav__link--contact">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default function StudioShell({
  children,
  active,
}: {
  children: ReactNode
  active: 'studio' | 'work'
}) {
  useReveal([])
  return (
    <div className="st">
      <a className="skip-link" href="#main">Skip to content</a>
      <StudioNav active={active} />
      <main id="main">{children}</main>
      <footer className="st-footer">
        <div className="st-footer__inner">
          <p>{STUDIO_NAME}</p>
          <p>{STUDIO_LOCATION}</p>
        </div>
      </footer>
    </div>
  )
}

/** The rotated dark tile + glass tile + icon emblem used above each section heading. */
export function Emblem({ children }: { children: ReactNode }) {
  return (
    <div className="st-emblem" aria-hidden="true">
      <span className="st-emblem__back" />
      <span className="st-emblem__glass" />
      <span className="st-emblem__icon">{children}</span>
    </div>
  )
}
