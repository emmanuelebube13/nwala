/** Studio content. Edit names, bios, links and email here — pages read from this file. */

export const STUDIO_NAME = 'Nwaala'
export const STUDIO_EMAIL = 'hello@nwaala.ca' // TODO: confirm the studio email
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
    short: 'Ifechukwu',
    role: 'Design Engineer',
    initials: 'IA',
    summary: 'Product designer. Founding designer at Dora; brand and web design for BAPOM Hospital.',
    bio: [
      'Ifechukwu designs websites and products that people can use the first time they open them. He has been the founding designer on a business voice-calling platform, redesigned the brand and website of a charity-funded hospital, and designed responsive interfaces for one of Nigeria’s largest mobile networks.',
      'He leads research, information architecture and visual design at Nwaala, and makes sure every screen meets accessibility standards before it ships.',
    ],
    skills: ['UX research', 'Information architecture', 'Visual & brand design', 'Accessible UI', 'Figma'],
    highlights: ['Founding designer, Dora', 'BAPOM Hospital rebrand', 'Telecom responsive design'],
  },
  {
    name: 'Emmanuel Mbachu',
    short: 'Emmanuel',
    role: 'Data Analyst',
    initials: 'EM',
    summary: 'Data analyst. Power BI reporting, mapping and housing research across Nova Scotia.',
    bio: [
      'Emmanuel turns messy records into reports that boards and funders can act on. He built a Power BI reporting suite on more than 355,000 Nova Scotia property sales, worked on mapping with Saint Mary’s University, and ran mixed-methods housing research for planning stakeholders.',
      'At Nwaala he builds the sites and the measurement behind them: forms that feed clean data, dashboards for volunteers and simple impact reports.',
    ],
    skills: ['Power BI & reporting', 'Mapping & GIS', 'Survey & mixed-methods research', 'Web development', 'Python & SQL'],
    highlights: ['355k+ NS property records', 'Saint Mary’s University mapping', 'NewRoots housing research'],
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
      'Website concept for a Nova Scotia community association: newcomer guide, program registration and a volunteer dashboard. Designed in Figma, then built as a working prototype.',
    type: 'UX · Web design · Build',
    credit: 'Ifechukwu (UX & visual design) · Emmanuel (data, reporting & build)',
    year: '2026',
    link: { label: 'View the concept', href: '/work/nicans', internal: true },
  },
  {
    title: 'BAPOM Hospital',
    tag: 'Branding & Web design',
    description: 'Brand and website redesign for a charity-funded hospital in Nigeria, supported from Nova Scotia.',
    type: 'Branding · Web design',
    credit: 'Ifechukwu (brand & web design) · backend by a development partner',
    link: { label: 'bapomhospital.com', href: 'https://bapomhospital.com' },
  },
  {
    title: 'Dora',
    tag: 'Branding & Product design',
    description: 'Founding design for a business voice-calling platform: product app and landing page.',
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
