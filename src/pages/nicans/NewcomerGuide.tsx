import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CaretRight, Check, DeviceMobile, Phone, Printer } from '@phosphor-icons/react'
import NicansLayout, { NC } from '../../components/nicans/NicansLayout.tsx'
import { useReveal } from '../../lib/useReveal.ts'
import { DEFAULT_STAGE, stages, type ChecklistItem } from './newcomer/stages.ts'
import './newcomer.css'

const STORAGE_KEY = 'nicans:newcomer-progress'
type Progress = Record<string, boolean>

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Progress
  } catch {
    /* storage unavailable */
  }
  return {}
}

function message(done: number, total: number, stageName: string) {
  if (total === 0) return ''
  if (done === 0) return 'Start with whatever feels most urgent. One step at a time.'
  if (done === total) return `${stageName} done. Well done!`
  if (done / total >= 0.5) return 'Halfway there! Keep going.'
  return 'You’re making a good start.'
}

function Item({ item, stageId, checked, onToggle }: { item: ChecklistItem; stageId: string; checked: boolean; onToggle: () => void }) {
  const id = `ng-${stageId}-${item.id}`
  return (
    <li className={`ng-item${checked ? ' is-done' : ''}`}>
      <span className="ng-check">
        <input id={id} type="checkbox" checked={checked} onChange={onToggle} aria-describedby={`${id}-d`} />
        <Check size={16} weight="bold" className="ng-check__icon" aria-hidden="true" />
      </span>
      <div className="ng-item__text">
        <label htmlFor={id} className="ng-item__title">
          {item.title}
        </label>
        <p id={`${id}-d`} className="ng-item__body">
          {item.body}
        </p>
        {item.link &&
          (item.link.internal ? (
            <Link to={item.link.href} className="ng-more">
              {item.link.label ?? 'Learn more'} <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          ) : (
            <a href={item.link.href} target="_blank" rel="noopener noreferrer" className="ng-more">
              {item.link.label ?? 'Learn more'}
              <span className="sr-only"> about {item.title.toLowerCase()} (opens in a new tab)</span>{' '}
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </a>
          ))}
      </div>
    </li>
  )
}

export default function NewcomerGuide() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [active, setActive] = useState(DEFAULT_STAGE)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  useReveal()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* storage unavailable: progress lives for this visit only */
    }
  }, [progress])

  // Keep the selected tab visible when the tab row scrolls horizontally (mobile).
  useEffect(() => {
    const idx = stages.findIndex((s) => s.id === active)
    const el = tabRefs.current[idx]
    const row = el?.parentElement
    if (!el || !row || row.scrollWidth <= row.clientWidth) return
    const left = el.offsetLeft - row.offsetLeft - 16
    row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [active])

  const stage = stages.find((s) => s.id === active) ?? stages[1]
  const countFor = (sid: string) => {
    const s = stages.find((x) => x.id === sid)!
    return s.items.filter((i) => progress[`${sid}:${i.id}`]).length
  }
  const done = countFor(stage.id)
  const total = stage.items.length
  const pct = total ? Math.round((done / total) * 100) : 0

  const toggle = (itemId: string) => {
    const key = `${stage.id}:${itemId}`
    setProgress((p) => ({ ...p, [key]: !p[key] }))
  }

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = -1
    if (e.key === 'ArrowRight') next = (idx + 1) % stages.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + stages.length) % stages.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = stages.length - 1
    if (next < 0) return
    e.preventDefault()
    setActive(stages[next].id)
    tabRefs.current[next]?.focus()
  }

  const progressCard = (
    <section className="ng-card ng-progress" aria-labelledby="ng-progress-title">
      <p className="ng-eyebrow" id="ng-progress-title">
        {stage.eyebrow}
      </p>
      <p className="ng-progress__count" aria-live="polite">
        <strong>
          {done} of {total}
        </strong>{' '}
        done
      </p>
      <div
        className="ng-bar"
        role="progressbar"
        aria-label={`${stage.title} progress`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={`${done} of ${total} done`}
      >
        <span className="ng-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="ng-progress__msg">{message(done, total, stage.title)}</p>
      <p className="ng-progress__saved">
        <DeviceMobile size={16} aria-hidden="true" />
        Saved on this device. No account needed.
      </p>
    </section>
  )

  return (
    <NicansLayout>
      <div className="ng">
        <section className="ng-hero">
          <div className="nc-container">
            <nav aria-label="Breadcrumb" className="ng-crumbs">
              <ol>
                <li>
                  <Link to={NC}>Home</Link>
                  <CaretRight size={12} weight="bold" aria-hidden="true" />
                </li>
                <li aria-current="page">New to Nova Scotia</li>
              </ol>
            </nav>
            <p className="ng-eyebrow ng-hero__eyebrow">Your newcomer guide</p>
            <h1 className="ng-hero__title">Welcome to Nova Scotia</h1>
            <p className="ng-hero__intro">
              Moving to a new country is a big step. This guide walks you through what to do, one stage at a time. Tick
              items off as you go. Your progress is saved on this device.
            </p>
          </div>
        </section>

        <div className="nc-container ng-body">
          <div className="ng-tabs" role="tablist" aria-label="Stages of settling in">
            {stages.map((s, i) => {
              const sel = s.id === active
              const c = countFor(s.id)
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`ng-tab-${s.id}`}
                  aria-selected={sel}
                  aria-controls="ng-panel"
                  tabIndex={sel ? 0 : -1}
                  className={`ng-tab${sel ? ' is-selected' : ''}`}
                  onClick={() => setActive(s.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  <span className="ng-tab__num">{s.num}</span>
                  <span className="ng-tab__label">{s.tab}</span>
                  <span className={`ng-tab__count${c === s.items.length ? ' is-complete' : ''}`}>
                    {c === s.items.length && <Check size={12} weight="bold" aria-hidden="true" />}
                    {c}/{s.items.length}
                    <span className="sr-only"> done</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="ng-grid">
            <div className="ng-main">
              <div className="ng-progress-mobile">{progressCard}</div>
              <div id="ng-panel" role="tabpanel" aria-labelledby={`ng-tab-${stage.id}`} className="ng-panel" key={stage.id}>
                <h2 className="ng-stage__title">{stage.title}</h2>
                <p className="ng-stage__sub">{stage.subtitle}</p>
                <ul className="ng-list" aria-label={`${stage.title} checklist`}>
                  {stage.items.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      stageId={stage.id}
                      checked={!!progress[`${stage.id}:${item.id}`]}
                      onToggle={() => toggle(item.id)}
                    />
                  ))}
                </ul>
              </div>
              <div className="ng-print">
                <button type="button" className="nc-btn nc-btn--outline" onClick={() => window.print()}>
                  <span className="nc-studs" aria-hidden="true" />
                  <Printer size={20} aria-hidden="true" />
                  Print / Save as PDF
                </button>
                <p>Take your checklist with you.</p>
              </div>
            </div>

            <aside className="ng-side" aria-label="Progress and support">
              <div className="ng-progress-desktop">{progressCard}</div>
              <section className="ng-card ng-dark" aria-labelledby="ng-alone">
                <h2 id="ng-alone">You don’t have to do it alone.</h2>
                <p className="ng-dark__sub">Talk to a NICANS volunteer</p>
                <p>A friendly connection as you find your feet in Nova Scotia.</p>
                <Link to={`${NC}/register?type=newcomer`} className="nc-btn ng-btn-white">
                  Talk to a NICANS volunteer
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </Link>
              </section>
              <section className="ng-card ng-help" aria-labelledby="ng-help-title">
                <h2 id="ng-help-title">
                  <Phone size={22} aria-hidden="true" />
                  Need help now?
                </h2>
                <a href="tel:211" className="ng-help__call">
                  Call 211
                </a>
                <p>Available 24/7, free, in many languages.</p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </NicansLayout>
  )
}
