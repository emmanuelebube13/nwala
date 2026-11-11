import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite'
import { guard, handleLock, handleSession, handleUnlock, type GateEnv } from './server/gate.ts'

/** Source files that hold NICANS concept content. Their code ships only in private chunks. */
const PRIVATE_SOURCES = [
  '/src/pages/nicans/',
  '/src/components/nicans/',
  '/src/data/nicans',
  '/src/pages/studio/NicansCase',
  '/src/pages/studio/NicansScreen',
]
const isPrivateModule = (id: string) => PRIVATE_SOURCES.some((p) => id.replace(/\\/g, '/').includes(p))

/**
 * Local emulation of the Vercel gate for `npm run dev` and `npm run preview`:
 * serves /api/unlock, /api/lock, /api/session and blocks private files, using .env.local.
 */
function nicansGate(env: GateEnv): Plugin {
  const toRequest = async (req: IncomingMessage): Promise<Request> => {
    const url = `http://${req.headers.host ?? 'localhost'}${req.url ?? '/'}`
    const chunks: Buffer[] = []
    if (req.method === 'POST') for await (const c of req) chunks.push(c as Buffer)
    const headers = new Headers()
    for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
    return new Request(url, {
      method: req.method,
      headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
    })
  }
  const send = async (res: ServerResponse, response: Response) => {
    res.statusCode = response.status
    response.headers.forEach((v, k) => res.setHeader(k, v))
    res.end(Buffer.from(await response.arrayBuffer()))
  }
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const path = (req.url ?? '/').split('?')[0]
    const route =
      path === '/api/unlock'
        ? (r: Request) => handleUnlock(r, env)
        : path === '/api/lock'
          ? (r: Request) => Promise.resolve(handleLock(r))
          : path === '/api/session'
            ? (r: Request) => handleSession(r, env)
            : null
    toRequest(req)
      .then(async (request) => {
        if (route) return send(res, await route(request))
        const denied = await guard(request, env)
        if (denied) return send(res, denied)
        next()
      })
      .catch(next)
  }
  return {
    name: 'nicans-gate',
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'NICANS_')
  return {
    plugins: [react(), nicansGate(env)],
    build: {
      rollupOptions: {
        output: {
          // NICANS code goes to /assets/private/, which the gate blocks without a valid session.
          chunkFileNames: (chunk) =>
            chunk.moduleIds.some(isPrivateModule) ? 'assets/private/[name]-[hash].js' : 'assets/[name]-[hash].js',
        },
      },
    },
  }
})
