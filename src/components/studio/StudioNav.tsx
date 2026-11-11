import { useEffect, useState } from 'react'
import { Header, Links, NavLink, Pill } from './StudioNav.styles.ts'

/** Floating Studio / Work pill navigation (Figma node 120:2641). */
export default function StudioNav({ active }: { active: 'studio' | 'work' }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Header>
      <Pill $scrolled={scrolled} aria-label="Main">
        <Links>
          <NavLink to="/" aria-current={active === 'studio' ? 'page' : undefined}>
            Studio
          </NavLink>
          <NavLink to="/work" aria-current={active === 'work' ? 'page' : undefined}>
            Work
          </NavLink>
        </Links>
      </Pill>
    </Header>
  )
}
