/**
 * NICANS password gate: shared by the Vercel functions (api/*), the Vercel Routing Middleware (proxy.ts)
 * and the local Vite dev/preview emulation (vite.config.ts). Never imported by browser code.
 *
 * - The password and signing secret live only in environment variables:
 *     NICANS_PASSWORD        accepted password(s); separate alternatives with commas
 *     NICANS_COOKIE_SECRET   long random string used to sign the session cookie
 * - A correct password sets a signed (HMAC-SHA256), httpOnly cookie valid for 30 days.
 * - Private files (/private/*, /assets/private/*) are served only with a valid cookie.
 * - No database: the signature is the proof.
 */

export type GateEnv = { NICANS_PASSWORD?: string; NICANS_COOKIE_SECRET?: string }

export const COOKIE = 'nicans_session'
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30
export const PRIVATE_PREFIXES = ['/private/', '/assets/private/']

const enc = new TextEncoder()

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })

function configured(env: GateEnv): env is Required<GateEnv> {
  return Boolean(env.NICANS_PASSWORD && env.NICANS_COOKIE_SECRET && env.NICANS_COOKIE_SECRET.length >= 32)
}

const normalize = (v: string) => v.trim().toLowerCase().replace(/\s+/g, ' ')

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(value)))
}

/** Constant-time comparison of two equal-length byte arrays. */
function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

/** Compares against every accepted password without short-circuiting, so timing does not leak which one matched. */
async function passwordMatches(input: string, env: Required<GateEnv>): Promise<boolean> {
  const given = await sha256(normalize(input))
  let ok = false
  for (const candidate of env.NICANS_PASSWORD.split(',')) {
    if (!candidate.trim()) continue
    if (equalBytes(given, await sha256(normalize(candidate)))) ok = true
  }
  return ok
}

function base64url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(payload))))
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie') ?? ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return null
}

function cookieAttributes(request: Request, maxAge: number): string {
  const url = new URL(request.url)
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
  const secure = url.protocol === 'https:' || local ? '; Secure' : ''
  return `; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

/** True when the request carries a valid, unexpired, correctly signed session cookie. */
export async function hasValidSession(request: Request, env: GateEnv): Promise<boolean> {
  if (!configured(env)) return false
  const value = readCookie(request, COOKIE)
  if (!value) return false
  const [exp, sig] = value.split('.')
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false
  const expected = await sign(exp, env.NICANS_COOKIE_SECRET)
  return equalBytes(await sha256(sig), await sha256(expected))
}

/** POST /api/unlock  { password } */
export async function handleUnlock(request: Request, env: GateEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { allow: 'POST' })
  if (!configured(env)) return json({ error: 'The concept is not available right now.' }, 503)

  let password = ''
  try {
    const body = (await request.json()) as { password?: unknown }
    password = typeof body.password === 'string' ? body.password.slice(0, 200) : ''
  } catch {
    return json({ error: 'Bad request' }, 400)
  }

  if (!(await passwordMatches(password, env))) {
    await new Promise((r) => setTimeout(r, 600)) // slow down guessing
    return json({ ok: false }, 401)
  }

  const exp = String(Date.now() + MAX_AGE_SECONDS * 1000)
  const value = `${exp}.${await sign(exp, env.NICANS_COOKIE_SECRET)}`
  return json({ ok: true }, 200, { 'set-cookie': `${COOKIE}=${value}${cookieAttributes(request, MAX_AGE_SECONDS)}` })
}

/** POST /api/lock: clears the session cookie. */
export function handleLock(request: Request): Response {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { allow: 'POST' })
  return json({ ok: true }, 200, { 'set-cookie': `${COOKIE}=${cookieAttributes(request, 0)}` })
}

/** GET /api/session → { unlocked } */
export async function handleSession(request: Request, env: GateEnv): Promise<Response> {
  return json({ unlocked: await hasValidSession(request, env) })
}

export function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))
}

/** Returns a 403 response for private paths without a valid session, or null to let the request through. */
export async function guard(request: Request, env: GateEnv): Promise<Response | null> {
  if (!isPrivatePath(new URL(request.url).pathname)) return null
  if (await hasValidSession(request, env)) return null
  return new Response('Forbidden', { status: 403, headers: { 'cache-control': 'no-store' } })
}
