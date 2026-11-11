import { handleLock } from '../server/gate.js'

export function POST(request: Request) {
  return handleLock(request)
}
