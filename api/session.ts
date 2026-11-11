import { handleSession } from '../server/gate.js'

export function GET(request: Request) {
  return handleSession(request, process.env)
}
