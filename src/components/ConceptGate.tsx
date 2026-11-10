import { useState, type FormEvent, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { LockSimple, WarningCircle } from '@phosphor-icons/react'
import StudioShell from './studio/StudioShell.tsx'
import { CONCEPT_HINT, CONCEPT_PASSWORD, isUnlocked, unlock, unlockFromQuery } from '../lib/unlock.ts'

/** Password page from the Figma "NICANS password" frames (default, hint revealed, incorrect). */
export default function ConceptGate({ children }: { children: ReactNode }) {
  const { search } = useLocation()
  const [open, setOpen] = useState(() => isUnlocked() || unlockFromQuery(search))
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [showHint, setShowHint] = useState(false)

  if (open) return <>{children}</>

  function submit(e: FormEvent) {
    e.preventDefault()
    if (value.trim().toLowerCase() === CONCEPT_PASSWORD) {
      unlock()
      setOpen(true)
    } else {
      setError(true)
    }
  }

  return (
    <StudioShell active="work">
      <section className="gate">
        <div className="gate__intro reveal is-visible">
          <span className="gate__tab">
            <LockSimple size={13} weight="bold" aria-hidden="true" /> Private concept
          </span>
          <h1>NICANS: a digital front desk</h1>
          <p>
            This concept was made for the Ndi Igbo Cultural Association of Nova Scotia and is shared privately, with
            permission. Enter the password from our proposal to view it.
          </p>
        </div>
        <form className="gate__form" onSubmit={submit} noValidate>
          <label htmlFor="gate-pw">Password</label>
          <div className="gate__row">
            <input
              id="gate-pw"
              type="password"
              autoComplete="off"
              autoFocus
              value={value}
              aria-invalid={error}
              aria-describedby={error ? 'gate-err' : showHint ? 'gate-hint' : undefined}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
            />
            <button type="submit" className="pill pill--dark">
              View concept
            </button>
          </div>
          {error && (
            <p id="gate-err" className="gate__error" role="alert">
              <WarningCircle size={18} weight="fill" aria-hidden="true" /> That password didn’t match. Check the
              proposal email, or reveal the hint.
            </p>
          )}
          {showHint ? (
            <p id="gate-hint" className="gate__hint">
              Hint: {CONCEPT_HINT}
            </p>
          ) : (
            <button type="button" className="gate__hint-btn" onClick={() => setShowHint(true)}>
              Show a hint
            </button>
          )}
        </form>
      </section>
    </StudioShell>
  )
}
