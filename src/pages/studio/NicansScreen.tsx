import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { STUDIO_LOCATION, STUDIO_NAME } from '../../data/studio.ts'
import { nicansScreens, screenFull, screenPath } from '../../data/nicansScreens.ts'
import {
  Aside,
  Close,
  Footer,
  Frame,
  Layout,
  Mobile,
  Pager,
  PagerLink,
  Reason,
  Reasons,
  Title,
} from './NicansScreen.styles.ts'

const ICONS = '/assets/studio/case'
const CLOSE_TO = '/work/nicans#screens'

/** One NICANS screen with its design reasoning (Figma node 177:583). */
export default function NicansScreen() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const index = nicansScreens.findIndex((s) => s.slug === slug)
  const screen = nicansScreens[index]
  const count = nicansScreens.length
  const prev = nicansScreens[(index - 1 + count) % count]
  const next = nicansScreens[(index + 1) % count]

  useEffect(() => {
    if (index < 0) return
    document.title = `${nicansScreens[index].title} · NICANS concept`
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (e.key === 'ArrowLeft') navigate(screenPath(prev.slug))
      if (e.key === 'ArrowRight') navigate(screenPath(next.slug))
      if (e.key === 'Escape') navigate(CLOSE_TO)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, prev.slug, next.slug, navigate])

  if (!screen) return <Navigate to={CLOSE_TO} replace />

  const isMobile = screen.slug.includes('mobile')
  const img = (
    <img
      src={screenFull(screen.slug)}
      alt={`${screen.title}, screen from the NICANS concept`}
      width={isMobile ? 390 : 2400}
    />
  )

  return (
    <>
      <a className="skip-link" href="#screen">
        Skip to screen
      </a>
      <Close to={CLOSE_TO} aria-label="Close and return to all screens">
        <img src={`${ICONS}/close.svg`} alt="" aria-hidden="true" width={20} height={20} />
      </Close>

      <Layout>
        <Pager aria-label="Screens">
          <PagerLink to={screenPath(prev.slug)} data-dir="prev" aria-label={`Previous screen: ${prev.title}`}>
            <img src={`${ICONS}/arrow-left.svg`} alt="" aria-hidden="true" width={24} height={24} />
          </PagerLink>
          <PagerLink to={screenPath(next.slug)} data-dir="next" aria-label={`Next screen: ${next.title}`}>
            <img src={`${ICONS}/arrow-right.svg`} alt="" aria-hidden="true" width={24} height={24} />
          </PagerLink>
        </Pager>
        <Aside aria-labelledby="screen-title">
          <Title id="screen-title">{screen.title}</Title>
          <Reasons>
            <Reason>
              <h2>Problem</h2>
              <p>{screen.problem}</p>
            </Reason>
            <Reason>
              <h2>Approach</h2>
              <p>{screen.approach}</p>
            </Reason>
            <Reason>
              <h2>Rationale</h2>
              <p>{screen.rationale}</p>
            </Reason>
          </Reasons>
        </Aside>

        <Frame id="screen">{isMobile ? <Mobile>{img}</Mobile> : img}</Frame>
      </Layout>

      <Footer>
        <div>
          <p>{STUDIO_NAME}</p>
          <p>{STUDIO_LOCATION}</p>
        </div>
      </Footer>
    </>
  )
}
