import { handleUnlock } from '../server/gate.js'

export function POST(request: Request) {
  return handleUnlock(request, process.env)
}
