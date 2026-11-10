/** Shared demo data for the NICANS concept. Registration and Dashboard both use this contract. */

export type RegistrationStatus = 'Confirmed' | 'Pending review' | 'Waitlisted'

export interface Registration {
  id: string
  name: string
  email: string
  program: string
  submitted: string // ISO date
  status: RegistrationStatus
  children?: number
  /** true when the visitor created it in this browser via the Register demo */
  live?: boolean
}

export interface Program {
  slug: string
  name: string
  date: string // display date
  time: string
  place: string
  audience: string
  blurb: string
}

export const programs: Program[] = [
  {
    slug: 'iri-ji',
    name: 'Iri Ji celebration',
    date: 'August 15, 2027',
    time: '12:00pm',
    place: '670 Rocky Lake Dr, Bedford',
    audience: 'All ages',
    blurb: 'The New Yam Festival: music, masquerade, roasted yam and family fun.',
  },
  {
    slug: 'afamefuna-2',
    name: 'Àfàmèfùnà · Episode 2',
    date: 'August 7, 2027',
    time: 'TBD',
    place: '6100 University Ave, Halifax',
    audience: 'All ages',
    blurb: 'Community documentary screening with Q&A, performances and food tastings.',
  },
  {
    slug: 'amara',
    name: 'Amara youth showcase',
    date: 'August 7, 2027',
    time: 'TBD',
    place: 'Halifax',
    audience: 'Youth 12–24',
    blurb: 'Igbo youth voices, creativity and cultural expression on stage.',
  },
  {
    slug: 'children-engaged',
    name: 'Children Engaged',
    date: 'Saturdays from Sept 11, 2027',
    time: '10:00am',
    place: 'Halifax Central Library',
    audience: 'Children 5–12',
    blurb: 'Igbo language, stories, songs and dance for children, every Saturday morning.',
  },
]

export const sampleRegistrations: Registration[] = [
  { id: 's1', name: 'Chiamaka Okafor', email: 'chiamaka.okafor@example.com', program: 'Iri Ji celebration', submitted: '2026-11-04', status: 'Confirmed' },
  { id: 's2', name: 'Emeka Nwosu', email: 'emeka.nwosu@example.com', program: 'Volunteer program', submitted: '2026-11-04', status: 'Pending review' },
  { id: 's3', name: 'Adaeze Eze', email: 'adaeze.eze@example.com', program: 'Membership', submitted: '2026-11-03', status: 'Confirmed' },
  { id: 's4', name: 'Chinedu Obi', email: 'chinedu.obi@example.com', program: 'Iri Ji celebration', submitted: '2026-11-03', status: 'Confirmed' },
  { id: 's5', name: 'Ngozi Okeke', email: 'ngozi.okeke@example.com', program: 'Volunteer program', submitted: '2026-11-02', status: 'Pending review' },
  { id: 's6', name: 'Obinna Uche', email: 'obinna.uche@example.com', program: 'Children Engaged', submitted: '2026-11-02', status: 'Confirmed', children: 2 },
  { id: 's7', name: 'Ifeoma Nnaji', email: 'ifeoma.nnaji@example.com', program: 'Amara youth showcase', submitted: '2026-11-01', status: 'Waitlisted' },
  { id: 's8', name: 'Kelechi Anyanwu', email: 'kelechi.anyanwu@example.com', program: 'Àfàmèfùnà · Episode 2', submitted: '2026-10-31', status: 'Confirmed' },
  { id: 's9', name: 'Amaka Ibe', email: 'amaka.ibe@example.com', program: 'Membership', submitted: '2026-10-30', status: 'Pending review' },
  { id: 's10', name: 'Tobenna Ezeh', email: 'tobenna.ezeh@example.com', program: 'Children Engaged', submitted: '2026-10-29', status: 'Confirmed', children: 1 },
]

const KEY = 'nicans:registrations'

/** Registrations the visitor made in this browser through the Register demo. */
export function loadLiveRegistrations(): Registration[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Registration[]) : []
  } catch {
    return []
  }
}

export function saveLiveRegistration(r: Registration): void {
  try {
    const all = loadLiveRegistrations()
    localStorage.setItem(KEY, JSON.stringify([{ ...r, live: true }, ...all].slice(0, 50)))
  } catch {
    /* storage unavailable: demo still completes, dashboard just won't show it */
  }
}
