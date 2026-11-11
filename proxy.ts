import { next } from '@vercel/functions'
import { guard } from './server/gate'

/**
 * Vercel Routing Middleware (configured in vercel.json → "proxy").
 * Blocks NICANS images (/private/*) and NICANS code chunks (/assets/private/*) without a valid session cookie.
 */
export default async function proxy(request: Request) {
  const denied = await guard(request, process.env)
  return denied ?? next()
}
