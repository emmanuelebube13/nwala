import { programs, type Program } from '../../../data/nicans.ts'

export type FlowKind = 'children' | 'event' | 'volunteer' | 'member' | 'partner' | 'newcomer'

export interface Child {
  id: string
  firstName: string
  lastName: string
  dob: string // DD/MM/YYYY
  level: '' | 'None' | 'Some' | 'Fluent'
  notes: string
}

export const emptyChild = (): Child => ({
  id: '',
  firstName: '',
  lastName: '',
  dob: '',
  level: '',
  notes: '',
})

export interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  language: string
  languageOther: string
  children: Child[]
  draft: Child
  editingId: string | null
  adults: number
  kids: number
  access: string
  interests: string[]
  availability: string[]
  why: string
  household: string
  householdSize: number
  householdNames: string
  orgName: string
  orgType: string
  collab: string[]
  orgMessage: string
  arrival: string
  city: string
  needs: string[]
  newcomerNotes: string
  consent: boolean
  photo: boolean
}

export const initialData = (): FormData => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  language: '',
  languageOther: '',
  children: [],
  draft: emptyChild(),
  editingId: null,
  adults: 1,
  kids: 0,
  access: '',
  interests: [],
  availability: [],
  why: '',
  household: '',
  householdSize: 2,
  householdNames: '',
  orgName: '',
  orgType: '',
  collab: [],
  orgMessage: '',
  arrival: '',
  city: '',
  needs: [],
  newcomerNotes: '',
  consent: false,
  photo: false,
})

export interface Flow {
  key: string
  kind: FlowKind
  program?: Program
  title: string
  /** Label used in the volunteer dashboard. */
  dashboardProgram: string
  steps: [string, string, string]
  stepIntro: [string, string, string]
  confirmTitle: string
}

export const languages = ['English', 'Igbo', 'French', 'Other'].map((l) => ({ value: l, label: l }))
export const volunteerInterests = ['Events', 'Youth mentoring', 'Newcomer welcome', 'Language classes', 'Media & photography', 'Admin']
export const availabilityOptions = ['Weekdays', 'Evenings', 'Weekends']
export const newcomerNeeds = [
  'Finding housing',
  'Jobs & credentials',
  'Schools for my children',
  'Health care',
  'Meeting the community',
  'Getting around',
]
export const partnerCollab = ['Sponsor an event', 'Co-host a program', 'In-kind support or venue', 'Volunteer team day', 'Media or promotion']
export const orgTypes = ['Non-profit or charity', 'Business', 'Government or public service', 'School or university', 'Faith or cultural group', 'Other'].map(
  (v) => ({ value: v, label: v }),
)
export const households = [
  { value: 'Individual', label: 'Individual', desc: 'Just me' },
  { value: 'Family', label: 'Family', desc: 'Parents and children' },
  { value: 'Student', label: 'Student', desc: 'Full-time student' },
  { value: 'Senior', label: 'Senior', desc: '65 and over' },
]

export function resolveFlow(params: URLSearchParams): Flow {
  const type = params.get('type')
  const intro1 = 'We’ll use these details to confirm your registration.'
  if (type === 'volunteer')
    return {
      key: 'volunteer',
      kind: 'volunteer',
      title: 'Volunteer with NICANS',
      dashboardProgram: 'Volunteer program',
      steps: ['Your details', 'Interests', 'Review & consent'],
      stepIntro: [intro1, 'Tell us where you’d like to help. You can change this later.', 'Check your answers before you send them.'],
      confirmTitle: 'Thanks for volunteering!',
    }
  if (type === 'member')
    return {
      key: 'member',
      kind: 'member',
      title: 'Become a member',
      dashboardProgram: 'Membership',
      steps: ['Your details', 'Household', 'Review & consent'],
      stepIntro: [intro1, 'Membership is open to individuals and families of all ages.', 'Check your answers before you send them.'],
      confirmTitle: 'Welcome to NICANS!',
    }
  if (type === 'partner')
    return {
      key: 'partner',
      kind: 'partner',
      title: 'Partner with NICANS',
      dashboardProgram: 'Partner enquiry',
      steps: ['Your details', 'Organisation', 'Review & consent'],
      stepIntro: ['Who should we get back to?', 'Tell us about your organisation and how you’d like to work together.', 'Check your answers before you send them.'],
      confirmTitle: 'Thanks for reaching out!',
    }
  if (type === 'newcomer')
    return {
      key: 'newcomer',
      kind: 'newcomer',
      title: 'Meet a NICANS volunteer',
      dashboardProgram: 'Newcomer support',
      steps: ['Your details', 'Your arrival', 'Review & consent'],
      stepIntro: [
        'A volunteer will use these details to say hello.',
        'This helps us match you with the right volunteer.',
        'Check your answers before you send them.',
      ],
      confirmTitle: 'Welcome! We’ll be in touch.',
    }
  const slug = params.get('program') ?? 'children-engaged'
  const program = programs.find((p) => p.slug === slug) ?? programs.find((p) => p.slug === 'children-engaged')!
  if (program.slug === 'children-engaged')
    return {
      key: `program:${program.slug}`,
      kind: 'children',
      program,
      title: `Register for ${program.name}`,
      dashboardProgram: program.name,
      steps: ['Parent/guardian', 'Child details', 'Review & consent'],
      stepIntro: [
        'We’ll use these details to contact you about your child’s place.',
        'Add each child you’d like to register. You can edit them at any time.',
        'Check your answers before you send them.',
      ],
      confirmTitle: 'You’re registered!',
    }
  return {
    key: `program:${program.slug}`,
    kind: 'event',
    program,
    title: `Register for ${program.name}`,
    dashboardProgram: program.name,
    steps: ['Your details', 'Attendees', 'Review & consent'],
    stepIntro: [intro1, 'Let us know who is coming so we can plan seats and food.', 'Check your answers before you send them.'],
    confirmTitle: 'You’re registered!',
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Parses DD/MM/YYYY; returns a Date or null. */
export function parseDob(s: string): Date | null {
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(y, mo - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null
  return date
}

export function validateChild(c: Child): Record<string, string> {
  const e: Record<string, string> = {}
  if (!c.firstName.trim()) e['child-first'] = "Enter your child's first name."
  if (!c.lastName.trim()) e['child-last'] = "Enter your child's last name."
  const dob = parseDob(c.dob)
  if (!c.dob.trim()) e['child-dob'] = "Enter your child's date of birth."
  else if (!dob) e['child-dob'] = 'Enter a real date in the format DD/MM/YYYY, for example 27/03/2019.'
  else if (dob > new Date()) e['child-dob'] = 'Date of birth must be in the past.'
  else if (new Date().getFullYear() - dob.getFullYear() > 18) e['child-dob'] = 'This program is for children. Check the year of birth.'
  if (!c.level) e['child-level-0'] = 'Choose an Igbo language level. “None” is perfectly fine.'
  return e
}

export const draftIsEmpty = (c: Child) => !c.firstName.trim() && !c.lastName.trim() && !c.dob.trim() && !c.level && !c.notes.trim()

export function validateStep(step: number, kind: FlowKind, d: FormData): Record<string, string> {
  const e: Record<string, string> = {}
  if (step === 1) {
    if (!d.firstName.trim()) e['rg-first'] = 'Enter your first name.'
    if (!d.lastName.trim()) e['rg-last'] = 'Enter your last name.'
    if (!d.email.trim()) e['rg-email'] = 'Enter your email address so we can confirm your registration.'
    else if (!EMAIL.test(d.email.trim())) e['rg-email'] = 'Enter an email address in the correct format, like name@example.com.'
    if (d.phone.trim() && d.phone.replace(/\D/g, '').length < 10) e['rg-phone'] = 'Enter a phone number with at least 10 digits, or leave it blank.'
    if (!d.language) e['rg-language'] = 'Choose your preferred language.'
    return e
  }
  if (step === 2) {
    switch (kind) {
      case 'children': {
        if (!draftIsEmpty(d.draft) || d.children.length === 0) {
          if (draftIsEmpty(d.draft) && d.children.length === 0) {
            e['child-first'] = 'Add at least one child to continue. Start with their first name.'
          } else Object.assign(e, validateChild(d.draft))
        }
        break
      }
      case 'event':
        if (d.adults + d.kids < 1) e['rg-adults'] = 'Add at least one person.'
        break
      case 'volunteer':
        if (d.interests.length === 0) e['rg-interests-0'] = 'Choose at least one area you’d like to help with.'
        if (d.availability.length === 0) e['rg-avail-0'] = 'Choose when you’re usually available.'
        break
      case 'member':
        if (!d.household) e['rg-household-0'] = 'Choose a membership type.'
        break
      case 'partner':
        if (!d.orgName.trim()) e['rg-org'] = 'Enter your organisation’s name.'
        if (!d.orgType) e['rg-orgtype'] = 'Choose the type of organisation.'
        if (d.collab.length === 0) e['rg-collab-0'] = 'Choose at least one way you’d like to work together.'
        break
      case 'newcomer':
        if (!d.city.trim()) e['rg-city'] = 'Enter the city or town where you live or plan to live.'
        if (d.needs.length === 0) e['rg-needs-0'] = 'Choose at least one thing we can help with.'
        break
    }
    return e
  }
  if (!d.consent) e['rg-consent'] = 'Tick the box to let us contact you about this registration.'
  return e
}
