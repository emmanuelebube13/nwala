import { handleUnlock } from '../server/gate'

export function POST(request: Request) {
  return handleUnlock(request, process.env)
}
