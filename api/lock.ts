import { handleLock } from '../server/gate'

export function POST(request: Request) {
  return handleLock(request)
}
