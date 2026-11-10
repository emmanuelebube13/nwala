import { Link } from 'react-router-dom'
import StudioShell from '../../components/studio/StudioShell.tsx'

export default function NotFound() {
  return (
    <StudioShell active="studio">
      <section className="gate" style={{ textAlign: 'center' }}>
        <div className="gate__intro" style={{ justifyItems: 'center' }}>
          <h1>Page not found</h1>
          <p>That link doesn’t go anywhere. Try the studio home page or our work.</p>
          <div className="st-hero__actions">
            <Link to="/" className="pill pill--dark">
              Studio home
            </Link>
            <Link to="/work" className="pill">
              Work
            </Link>
          </div>
        </div>
      </section>
    </StudioShell>
  )
}
