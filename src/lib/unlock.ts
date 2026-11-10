/** Password for the private NICANS concept. Change it here; share it in the proposal email. */
export const CONCEPT_PASSWORD = 'njiko'
export const CONCEPT_HINT = 'The first word of the NICANS motto, “… bu Oganiru”. Lowercase.'

const KEY = 'nwala:nicans-unlocked'

export function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1' || localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function unlock(): void {
  try {
    sessionStorage.setItem(KEY, '1')
    localStorage.setItem(KEY, '1')
  } catch {
    /* storage unavailable: unlock lasts for this page view only */
  }
}

/** Lets a link like /work/nicans?key=njiko open the concept directly (handy for the proposal email). */
export function unlockFromQuery(search: string): boolean {
  const key = new URLSearchParams(search).get('key')
  if (key && key.trim().toLowerCase() === CONCEPT_PASSWORD) {
    unlock()
    return true
  }
  return false
}
