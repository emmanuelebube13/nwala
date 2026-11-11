import { type ReactNode } from 'react'
import { STUDIO_LOCATION, STUDIO_NAME } from '../../data/studio.ts'
import { useReveal } from '../../lib/useReveal.ts'
import StudioNav from './StudioNav.tsx'
import './studio.css'

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
