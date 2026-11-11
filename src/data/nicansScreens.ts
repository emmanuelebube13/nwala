/** NICANS concept screens: thumbnails, full screens and the design reasoning shown on each screen page. */

const SHOTS = '/private/nicans/screens'

export type NicansScreen = {
  slug: string
  title: string
  /** Live concept route, for reference. */
  live: string
  problem: string
  approach: string
  rationale: string
}

export const nicansScreens: NicansScreen[] = [
  {
    slug: '01-home-desktop',
    title: 'Home: desktop',
    live: '/concept/nicans',
    problem:
      'The current site introduces the association before offering help. Newcomers have to dig to find a useful next step.',
    approach:
      'The concept opens with a photo from a community celebration and two direct actions. “How can we help you today?” leads to one pathway per audience, followed by upcoming events and quick answers.',
    rationale:
      'People arrive with a task. Real community photography is intended to build trust rather than rely on stock imagery. Events and quick answers address common questions before someone needs to email.',
  },
  {
    slug: '02-home-mobile',
    title: 'Home: mobile',
    live: '/concept/nicans',
    // DRAFT: mobile-specific copy for Ifechukwu to review.
    problem:
      'Many newcomers first meet the association on a phone, often on limited data and sometimes reading in a second language.',
    approach:
      'The same task-first home page, designed for small screens first. The pathways stack into a single column, actions stay within thumb reach and text stays large and plain.',
    rationale:
      'Designing for the phone first keeps the most common tasks one or two taps away, so the site works for people who never use a laptop.',
  },
  {
    slug: '03-newcomer-guide',
    title: 'Newcomer guide: first week',
    live: '/concept/nicans/newcomers',
    problem: 'Settling in involves dozens of steps, and newcomers may not know which to take first.',
    approach:
      'Four stages run from before arrival to the first 3–6 months, each with a short checklist. The concept saves progress on the device without an account and offers printing. “Talk to a volunteer” and “Call 211” stay visible.',
    rationale:
      'Device-based progress avoids an account barrier on arrival. A printed list supports limited data or a preference for paper. Visible routes to human help keep the checklist from becoming a dead end.',
  },
  {
    slug: '04-register-first-child',
    title: 'Registration: first child',
    live: '/concept/nicans/register',
    problem: 'Paper and email registration can leave details missing and create back-and-forth.',
    approach:
      'A three-step flow covers parent details, child details, then review & consent. Labels sit above fields, hints explain what is needed, and errors pair an icon with plain text.',
    rationale:
      'Short steps are intended to make the form manageable. Labels remain visible while typing. Errors that do not rely on colour are designed to support colour-blind users and screen-reader users.',
  },
  {
    slug: '05-register-child-added',
    title: 'Registration: child added',
    live: '/concept/nicans/register',
    problem: 'Families with more than one child should not have to repeat the entire registration form.',
    approach:
      'After saving, each child appears as a summary card with Edit and Remove actions. A clear “Add another child” area sits below.',
    rationale:
      'The summary makes saved details visible and gives parents a way to correct mistakes without starting over.',
  },
  {
    slug: '06-register-add-another',
    title: 'Registration: another child',
    live: '/concept/nicans/register',
    problem:
      'Adding another child needs to preserve the details already entered, without introducing a new process.',
    approach: 'The same short form opens below the saved child, keeping the first child’s details visible and safe.',
    rationale:
      'Repeating the same form keeps the interaction consistent, so there is nothing new to learn the second time.',
  },
  {
    slug: '07-register-confirmation',
    title: 'Registration: confirmation',
    live: '/concept/nicans/register',
    problem:
      'Without a clear confirmation, people may email to ask whether their registration went through, adding work for volunteers.',
    approach:
      'The concept provides instant on-screen confirmation, an automatic email, a reminder before each session and an “Add to calendar” action.',
    rationale:
      'Clear confirmation and reminders are intended to answer the follow-up questions that volunteers would otherwise handle by email.',
  },
  {
    slug: '08-dashboard',
    title: 'Management hub (dashboard)',
    live: '/concept/nicans/dashboard',
    problem: 'Registrations, volunteer applications and enquiries were spread across inboxes and spreadsheets.',
    approach:
      'One hub brings weekly numbers above a searchable table, with program and status filters and one-click CSV export.',
    rationale:
      'The aim is one screen for volunteers to review everything, with exports for board and funder reports. The same data can feed simple impact reports.',
  },
]

export const screenThumb = (slug: string) => `${SHOTS}/${slug}.webp`
export const screenFull = (slug: string) => `${SHOTS}/full/${slug}.webp`
export const screenPath = (slug: string) => `/work/nicans/screens/${slug}`
