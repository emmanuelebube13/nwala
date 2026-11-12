/**
 * Client side of the NICANS gate. The password is checked on the server (/api/unlock), which sets a signed,
 * httpOnly session cookie. Nothing secret lives in the browser: this module only asks the server.
 */


let session: Promise<boolean> | null = null
let known: boolean | null = null

/** Whether this visitor has a valid session. Cached for the page view; call refreshSession() to re-check. */
export function getSession(): Promise<boolean> {
  if (!session) {
    session = fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { unlocked: false }))
      .then((d: { unlocked?: boolean }) => (known = Boolean(d.unlocked)))
      .catch(() => (known = false))
  }
  return session
}

export function refreshSession(): Promise<boolean> {
  session = null
  return getSession()
}

/** Last known session state, without a network request (null until checked). */
export function knownSession(): boolean | null {
  return known
}

export type UnlockResult = 'ok' | 'wrong' | 'unavailable'

export async function unlock(password: string): Promise<UnlockResult> {
  try {
    const r = await fetch('/api/unlock', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (r.ok) {
      known = true
      session = Promise.resolve(true)
      return 'ok'
    }
    return r.status === 401 ? 'wrong' : 'unavailable'
  } catch {
    return 'unavailable'
  }
}

export async function lock(): Promise<void> {
  await fetch('/api/lock', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined)
  known = false
  session = Promise.resolve(false)
}
