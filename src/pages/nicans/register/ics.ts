/** Builds a minimal, valid iCalendar file (RFC 5545) for a NICANS program. */

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

/** Parses "August 15, 2027" or "Saturdays from Sept 11, 2027" into [y, m, d]. */
export function parseDisplayDate(s: string): [number, number, number] | null {
  const m = s.toLowerCase().match(/([a-z]+)\.?\s+(\d{1,2}),\s*(\d{4})/)
  if (!m) return null
  const idx = MONTHS.findIndex((name) => name.startsWith(m[1].slice(0, 3)))
  if (idx < 0) return null
  return [Number(m[3]), idx + 1, Number(m[2])]
}

const pad = (n: number) => String(n).padStart(2, '0')

const escapeText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

/** Folds lines longer than 75 octets (approximate by characters, fine for this content). */
const fold = (line: string) => {
  const out: string[] = []
  let rest = line
  while (rest.length > 74) {
    out.push(rest.slice(0, 74))
    rest = ' ' + rest.slice(74)
  }
  out.push(rest)
  return out.join('\r\n')
}

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:America/Halifax',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:-0400',
  'TZOFFSETTO:-0300',
  'TZNAME:ADT',
  'DTSTART:19700308T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:-0300',
  'TZOFFSETTO:-0400',
  'TZNAME:AST',
  'DTSTART:19701101T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

export interface IcsEvent {
  uid: string
  title: string
  description: string
  location: string
  date: [number, number, number]
  startHour: number
  endHour: number
}

export function buildIcs(e: IcsEvent): string {
  const [y, mo, d] = e.date
  const day = `${y}${pad(mo)}${pad(d)}`
  const now = new Date()
  const stamp =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T` +
    `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NICANS//Concept registration//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...VTIMEZONE,
    'BEGIN:VEVENT',
    `UID:${e.uid}@nicans.concept`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/Halifax:${day}T${pad(e.startHour)}0000`,
    `DTEND;TZID=America/Halifax:${day}T${pad(e.endHour)}0000`,
    `SUMMARY:${escapeText(e.title)}`,
    `DESCRIPTION:${escapeText(e.description)}`,
    `LOCATION:${escapeText(e.location)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(e.title)}`,
    'TRIGGER:-P2D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

export function downloadIcs(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
