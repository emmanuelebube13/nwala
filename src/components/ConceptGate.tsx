import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import StudioShell from './studio/StudioShell.tsx'
import PasswordDialog from './studio/PasswordDialog.tsx'
import { isUnlocked, unlockFromQuery } from '../lib/unlock.ts'

/** Protects the NICANS case study and concept. Direct visits see the password pop-up over a blank studio page. */
export default function ConceptGate({ children }: { children: ReactNode }) {
  const { search } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(() => isUnlocked() || unlockFromQuery(search))

  if (open) return <>{children}</>

  return (
    <StudioShell active="work">
      <div style={{ minHeight: '70vh' }} />
      <PasswordDialog open onClose={() => navigate('/work')} onSuccess={() => setOpen(true)} />
    </StudioShell>
  )
}
