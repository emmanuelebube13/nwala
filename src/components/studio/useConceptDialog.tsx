import { useCallback, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordDialog from './PasswordDialog.tsx'
import { isUnlocked } from '../../lib/unlock.ts'

/** "View the concept" links: open the password pop-up in place, then go to the case study. */
export function useConceptDialog(target = '/work/nicans') {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const onOpen = useCallback(
    (e: MouseEvent) => {
      if (isUnlocked()) return // let the link navigate normally
      e.preventDefault()
      setOpen(true)
    },
    [],
  )
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
