import { useState } from 'react'
import { workstreams } from '../data/workstreams'
import type { Workstream } from '../types/project'
import '../styles/App.css'

function WorkstreamCard({ workstream }: { workstream: Workstream }) {
  const icon = workstream.number === '01' ? '◒' : workstream.number === '02' ? '◇' : '✦'

  return (
    <article className={`work-card ${workstream.color}`}>
      <div className="card-topline"><span>{workstream.number}</span><span>{workstream.status}</span></div>
      <div className="card-icon" aria-hidden="true">{icon}</div>
      <h3>{workstream.title}</h3>
      <p>{workstream.description}</p>
      <div className="progress-label"><span>Progress</span><strong>{workstream.progress}%</strong></div>
      <div className="progress-track"><div style={{ width: `${workstream.progress}%` }} /></div>
    </article>
  )
}

function App() {
  const [activeView, setActiveView] = useState('Overview')
  const [isStarted, setIsStarted] = useState(false)

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="Nwala home"><span className="brand-mark">N</span><span>nwala</span></a>
        <div className="nav-links">
          {['Overview', 'Roadmap', 'Notes'].map((view) => (
            <button className={activeView === view ? 'nav-link active' : 'nav-link'} key={view} onClick={() => setActiveView(view)} type="button">{view}</button>
          ))}
        </div>
        <button className="avatar" type="button" aria-label="Open account menu">EB</button>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Building in public</p>
          <h1>Something <em>worth</em><br />building.</h1>
          <p className="hero-description">Nwala is the home for a bigger idea. A place to think clearly, move deliberately, and make meaningful things together.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setIsStarted(true)} type="button">{isStarted ? 'You are on the list' : 'Join the build'} <span aria-hidden="true">-&gt;</span></button>
            <a className="text-button" href="#workstreams">See the roadmap <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-art" aria-label="Abstract illustration of an idea taking shape" role="img">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="sun">N</div>
          <span className="spark spark-one">+</span><span className="spark spark-two">+</span><span className="spark spark-three">+</span>
        </div>
      </section>

      <section className="stats-row" aria-label="Project statistics">
        <div><strong>01</strong><span>Big idea<br />in motion</span></div>
        <div><strong>03</strong><span>Active<br />workstreams</span></div>
        <div><strong>∞</strong><span>Ways to<br />contribute</span></div>
        <p>Last updated<br /><b>Today, 08:00 AM</b></p>
      </section>

      <section className="work-section" id="workstreams">
        <div className="section-heading">
          <div><p className="eyebrow">The path ahead</p><h2>{activeView === 'Overview' ? 'A work in progress.' : activeView}</h2></div>
          <p className="section-intro">The destination is ambitious.<br />The next step is simple.</p>
        </div>
        <div className="work-grid">{workstreams.map((workstream) => <WorkstreamCard key={workstream.number} workstream={workstream} />)}</div>
      </section>

      <footer><span>nwala / 2026</span><span>Made for the long game.</span><a href="mailto:hello@nwala.dev">Say hello -&gt;</a></footer>
    </main>
  )
}

export default App
