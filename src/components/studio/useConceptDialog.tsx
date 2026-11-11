import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordDialog from './PasswordDialog.tsx'
import { getSession, knownSession } from '../../lib/unlock.ts'

/** "View the concept" links: open the password pop-up in place, then go to the case study. */
export function useConceptDialog(target = '/work/nicans') {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // Check the session early so returning visitors go straight through.
  useEffect(() => {
    void getSession()
  }, [])

  const onOpen = useCallback((e: MouseEvent) => {
    if (knownSession()) return // valid session: let the link navigate normally
    e.preventDefault()
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])

  const dialog = (
    <PasswordDialog
      open={open}
      onClose={close}
      onSuccess={() => {
        setOpen(false)
        navigate(target)
      }}
    />
  )
  return { onOpen, dialog }
}
