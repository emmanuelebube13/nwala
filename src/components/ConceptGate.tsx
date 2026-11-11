import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import StudioShell from './studio/StudioShell.tsx'
import PasswordDialog from './studio/PasswordDialog.tsx'
import { getSession, knownSession } from '../lib/unlock.ts'

/**
 * Protects the NICANS pages. The server decides: until /api/session confirms a valid session, the protected
 * page (and its private code chunk) is never loaded. Direct visits see the password pop-up over a blank studio page.
 */
export default function ConceptGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [state, setState] = useState<'checking' | 'locked' | 'unlocked'>(() => {
    const k = knownSession()
    return k === null ? 'checking' : k ? 'unlocked' : 'locked'
  })

  useEffect(() => {
    if (state !== 'checking') return
    let live = true
    getSession().then((ok) => live && setState(ok ? 'unlocked' : 'locked'))
    return () => {
      live = false
    }
  }, [state])

  if (state === 'unlocked') return <>{children}</>

  return (
    <StudioShell active="work">
      <div style={{ minHeight: '70vh' }} aria-busy={state === 'checking'} />
      {state === 'locked' && (
        <PasswordDialog open onClose={() => navigate('/work')} onSuccess={() => setState('unlocked')} />
      )}
    </StudioShell>
  )
}
