import { handleSession } from '../server/gate'

export function GET(request: Request) {
  return handleSession(request, process.env)
}
