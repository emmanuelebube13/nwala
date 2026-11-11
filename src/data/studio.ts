/** Studio content. Edit names, bios, links and email here — pages read from this file. */

export const STUDIO_NAME = 'Nwaala'
export const STUDIO_EMAIL = 'emmanuelasiegbu98@gmail.com'
export const STUDIO_LOCATION = 'Halifax, Nova Scotia'

export interface Founder {
  name: string
  short: string
  role: string
  initials: string
  /** One or two lines shown beside the portrait */
  summary: string
  /** Headshot in public/assets/studio/, e.g. '/assets/studio/ifechukwu.jpg'. Initials show until one is added. */
  photo?: string
  bio: string[]
  skills: string[]
  highlights: string[]
}

export const founders: Founder[] = [
  {
    name: 'Ifechukwu Asiegbu',
    photo: '/assets/studio/founders/ifechukwu.jpg',
    short: 'Ifechukwu',
    role: 'Design Engineer',
    initials: 'IA',
    summary: 'Designer and full-stack developer: JavaScript, WordPress and .NET.',
    bio: [
      'Ifechukwu designs and builds websites and apps, from the first sketch to the finished, working site. He builds with JavaScript, WordPress and .NET, so one person can take a project from idea to launch.',
      'He was the founding designer of a delivery automation app, rebuilt the brand and website of a charity-funded hospital, and designed phone-friendly pages for one of Nigeria’s largest mobile networks. At Nwaala he leads design and development, and makes sure every page is easy to use for everyone.',
    ],
    skills: ['Design', 'JavaScript', 'WordPress', '.NET', 'Accessible websites'],
    highlights: ['Founding designer, Dora', 'BAPOM Hospital rebrand', 'Telecom responsive design'],
  },
  {
    name: 'Emmanuel Mbachu',
    photo: '/assets/studio/founders/emmanuel.jpg',
    short: 'Emmanuel',
    role: 'Data Analyst',
    initials: 'EM',
    summary: 'Data analyst: measurement built into the code, testing and site building.',
    bio: [
      'Emmanuel is Nwaala’s data analyst. He builds measurement into the sites themselves, so we can see how a site performs, how people use it, and which parts of the code need to be faster.',
      'He also helps build the sites, checks them with clients before launch, and tests ideas against real data to see what actually works. Before Nwaala he built a Power BI report on more than 355,000 Nova Scotia property sales, built an interactive map with Toronto Metropolitan University showing the support available to students in rural Nova Scotia, and ran housing research for planners.',
    ],
    skills: ['Data tracking & analytics', 'Power BI & reporting', 'Testing ideas with data', 'User testing', 'Web development'],
    highlights: ['355k+ NS property records', 'TMU student support map', 'NewRoots housing research'],
  },
]

export interface Project {
  title: string
  /** Chip above the title, as in the Selected Work frame */
  tag: string
  tagStyle?: 'private' | 'nda'
  description: string
  type: string
  credit: string
  year?: string
  link?: { label: string; href: string; internal?: boolean }
  note?: string
}

/** Order and tags follow the final "Selected work" frame (Figma Page 3). */
export const projects: Project[] = [
  {
    title: 'NICANS: Digital Front Desk',
    tag: 'Private concept',
    tagStyle: 'private',
    description:
      'A “digital front desk” for the Ndi Igbo Cultural Association of Nova Scotia: newcomers follow a step-by-step settling-in guide, families sign up for programs online, and volunteers see every registration in one place.',
    type: 'UX · Web design',
    credit: 'Ifechukwu (UX & visual design)',
    year: '2026',
    link: { label: 'View the concept', href: '/work/nicans', internal: true },
  },
  {
    title: 'BAPOM Hospital',
    tag: 'Branding & Web design',
    description:
      'A new brand and website for the Boniface & Paulina Okafor Memorial Hospital, a charity-funded hospital in Nigeria backed by supporters in Canada. The site shows the hospital’s impact and makes it easy to donate.',
    type: 'Branding · Web design',
    credit: 'Ifechukwu (brand & web design) · Nikkayo Williams (backend)',
    link: { label: 'bapomhospital.com', href: 'https://bapomhospital.com' },
  },
  {
    title: 'Dora',
    tag: 'Branding & Product design',
    description:
      'Founding design for Dora when it was a delivery automation product: the first app and the landing page. Dora has since moved into business calling.',
    type: 'Branding · Product design',
    credit: 'Ifechukwu (founding designer)',
    link: { label: 'usedora.com', href: 'https://usedora.com' },
  },
  {
    title: 'Telecom responsive design',
    tag: 'NDA',
    tagStyle: 'nda',
    description: 'Responsive interface design for a major Nigerian mobile network, via Genesys Tech Hub for Tenece.',
    type: 'Web design',
    credit: 'Ifechukwu (contract designer)',
    note: 'Under NDA. Walkthrough available on request.',
  },
  {
    title: 'Nova Scotia Property & Parcel Sales Intelligence',
    tag: 'Data & Mapping',
    description:
      'Power BI reporting suite built on 355,000+ Nova Scotia property sales records (2018–2026), with map links.',
    type: 'Data · Mapping',
    credit: 'Emmanuel',
    link: {
      label: 'Open the live report',
      href: 'https://app.powerbi.com/view?r=eyJrIjoiY2FhZjcyYjMtYjQ0NS00MzQyLTg4YmMtZWM5OWUwYzUxN2I0IiwidCI6ImU3ZTc2NmE4LTY3NDEtNDdhNy1iNDEwLWUwZDJiNzMxYzMyYSJ9',
    },
  },
  {
    title: 'Nova Scotia Student Homelessness Survey Analytics',
    tag: 'NDA',
    tagStyle: 'nda',
    description:
      'Survey analytics on student homelessness in Nova Scotia, carried out with Toronto Metropolitan University (TMU).',
    type: 'Data · Research',
    credit: 'Emmanuel (data analyst), with TMU',
    note: 'Under NDA. Walkthrough available on request.',
  },
  {
    title: 'Housing research: NewRoots',
    tag: 'Data & Research',
    description: 'Mixed-methods housing research combining survey data and interviews for planning stakeholders.',
    type: 'Data · Research',
    credit: 'Emmanuel (data analyst)',
    year: '2025–2026',
  },
]
