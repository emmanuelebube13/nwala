import { useEffect, useRef, useState, type FormEvent } from 'react'
import { WarningCircle, X } from '@phosphor-icons/react'
import { CONCEPT_HINT, checkPassword, unlock } from '../../lib/unlock.ts'

/** Password pop-up from the final Figma "password" frame. */
export default function PasswordDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const t = window.setTimeout(() => input.current?.focus(), 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button, input')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  function submit(e: FormEvent) {
    e.preventDefault()
    if (checkPassword(value)) {
      unlock()
      setValue('')
      setError(false)
      onSuccess()
    } else {
      setError(true)
      input.current?.focus()
    }
  }

  return (
    <div className="pw-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pw" role="dialog" aria-modal="true" aria-labelledby="pw-title" ref={panel}>
        <button type="button" className="pw__close" onClick={onClose} aria-label="Close">
          <X size={24} aria-hidden="true" />
        </button>
        <h2 id="pw-title" className="pw__title">
          NICANS: Digital Front Desk
        </h2>
        <form className="pw__form" onSubmit={submit} noValidate>
          <div className="pw__field">
            <label htmlFor="pw-input">Password</label>
            <input
              id="pw-input"
              ref={input}
              type="password"
              autoComplete="off"
              placeholder="Enter password"
              value={value}
              aria-invalid={error}
              aria-describedby="pw-help"
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
            />
            {error ? (
              <p id="pw-help" className="pw__help pw__help--error" role="alert">
                <WarningCircle size={16} weight="fill" aria-hidden="true" /> That didn’t match. {CONCEPT_HINT}
              </p>
            ) : (
              <p id="pw-help" className="pw__help">
                {CONCEPT_HINT}
              </p>
            )}
          </div>
          <button type="submit" className="pill pill--dark">
            View Concept
          </button>
        </form>
      </div>
    </div>
  )
}
