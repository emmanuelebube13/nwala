import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ConceptGate from '../components/ConceptGate.tsx'

const StudioHome = lazy(() => import('../pages/studio/Home.tsx'))
const StudioWork = lazy(() => import('../pages/studio/Work.tsx'))
const CaseStudy = lazy(() => import('../pages/studio/CaseStudy.tsx'))
const NotFound = lazy(() => import('../pages/studio/NotFound.tsx'))

const NicansLanding = lazy(() => import('../pages/nicans/Landing.tsx'))
const NicansNewcomers = lazy(() => import('../pages/nicans/NewcomerGuide.tsx'))
const NicansRegister = lazy(() => import('../pages/nicans/Register.tsx'))
const NicansDashboard = lazy(() => import('../pages/nicans/Dashboard.tsx'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<StudioHome />} />
          <Route path="/work" element={<StudioWork />} />
          <Route
            path="/work/nicans"
            element={
              <ConceptGate>
                <CaseStudy />
              </ConceptGate>
            }
          />
          <Route
            path="/concept/nicans"
            element={
              <ConceptGate>
                <NicansLanding />
              </ConceptGate>
            }
          />
          <Route
            path="/concept/nicans/newcomers"
            element={
              <ConceptGate>
                <NicansNewcomers />
              </ConceptGate>
            }
          />
          <Route
            path="/concept/nicans/register"
            element={
              <ConceptGate>
                <NicansRegister />
              </ConceptGate>
            }
          />
          <Route
            path="/concept/nicans/dashboard"
            element={
              <ConceptGate>
                <NicansDashboard />
              </ConceptGate>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
