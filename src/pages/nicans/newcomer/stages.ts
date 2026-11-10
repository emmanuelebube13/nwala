/** Newcomer guide content. General guidance only; every link points to an official or established source. */

export interface ChecklistItem {
  id: string
  title: string
  body: string
  link?: { href: string; label?: string; internal?: boolean }
}

export interface Stage {
  id: string
  num: string
  tab: string
  title: string
  subtitle: string
  eyebrow: string
  items: ChecklistItem[]
}

const NC = '/concept/nicans'

export const stages: Stage[] = [
  {
    id: 'before',
    num: '01',
    tab: 'Before you arrive',
    title: 'Before you arrive',
    subtitle: 'Get your papers and plans in order so your first days are calmer.',
    eyebrow: 'Before you arrive',
    items: [
      {
        id: 'docs',
        title: 'Gather your important documents',
        body: 'Keep passports, immigration papers, birth and marriage certificates, school records and diplomas together in your carry-on. Bring certified translations if they are not in English or French.',
        link: { href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/prepare-life-canada/prepare-travel.html' },
      },
      {
        id: 'temp-housing',
        title: 'Book temporary housing',
        body: 'Arrange somewhere to stay for your first few weeks, so you can look for a longer-term home in person.',
      },
      {
        id: 'winter',
        title: 'Budget for winter clothing',
        body: 'Nova Scotia winters are cold, wet and windy. Plan to buy a warm coat, waterproof boots, hat and gloves locally once you arrive.',
      },
      {
        id: 'funds',
        title: 'Plan your first-month budget',
        body: 'Rent deposits, groceries, transit and a phone plan add up quickly. Bring proof of funds and some money you can access right away.',
      },
      {
        id: 'nicans-online',
        title: 'Connect with NICANS online',
        body: 'Tell us when you are arriving. A community volunteer can answer questions before you land.',
        link: { href: `${NC}/register?type=newcomer`, label: 'Connect with us', internal: true },
      },
    ],
  },
  {
    id: 'week',
    num: '02',
    tab: 'Your first week',
    title: 'Your first week',
    subtitle: 'A few important steps to help you settle in.',
    eyebrow: 'Your first week',
    items: [
      {
        id: 'sin',
        title: 'Apply for your Social Insurance Number (SIN)',
        body: 'You need a SIN to work and to access government benefits. Apply online or at a Service Canada office.',
        link: { href: 'https://www.canada.ca/en/employment-social-development/services/sin.html' },
      },
      {
        id: 'msi',
        title: 'Apply for your Nova Scotia health card (MSI)',
        body: 'Apply as soon as possible after you arrive. Coverage start dates vary, so check your eligibility with MSI.',
        link: { href: 'https://novascotia.ca/dhw/msi/' },
      },
      {
        id: 'phone',
        title: 'Get a Canadian phone number',
        body: 'Compare prepaid and monthly plans. A local number makes everything else easier.',
      },
      {
        id: 'bank',
        title: 'Open a bank account',
        body: 'Bring your passport and immigration documents. Many banks have newcomer packages.',
      },
      {
        id: 'housing',
        title: 'Find longer-term housing',
        body: 'Learn about your rights as a tenant in Nova Scotia before signing a lease.',
        link: { href: 'https://novascotia.ca/sns/access/land/residential-tenancies.asp' },
      },
      {
        id: 'transit',
        title: 'Get a Halifax Transit pass or route plan',
        body: 'Buses and ferries connect Halifax and Dartmouth.',
        link: { href: 'https://www.halifax.ca/transportation/halifax-transit' },
      },
      {
        id: 'hello',
        title: 'Say hello to NICANS',
        body: "Register as a newcomer and we'll connect you with a community volunteer.",
        link: { href: `${NC}/register?type=newcomer`, label: 'Register as a newcomer', internal: true },
      },
    ],
  },
  {
    id: 'month',
    num: '03',
    tab: 'Your first month',
    title: 'Your first month',
    subtitle: 'Set up the services your household will rely on.',
    eyebrow: 'Your first month',
    items: [
      {
        id: 'doctor',
        title: 'Join the Need a Family Practice Registry',
        body: 'Register to be matched with a family doctor or nurse practitioner. Until then, call 811 for health advice any time of day.',
        link: { href: 'https://needafamilypractice.nshealth.ca/' },
      },
      {
        id: 'school',
        title: 'Register your children for school',
        body: 'Public schools in Halifax are run by the Halifax Regional Centre for Education (HRCE). Contact your local school to register.',
        link: { href: 'https://www.hrce.ca/' },
      },
      {
        id: 'licence',
        title: "Exchange or apply for a driver's licence",
        body: 'Rules depend on where your licence was issued. Check with Access Nova Scotia about exchanging it or taking a road test.',
        link: { href: 'https://novascotia.ca/sns/rmv/licence/' },
      },
      {
        id: 'work',
        title: 'Get help with work and credentials',
        body: 'Settlement agencies such as ISANS offer employment services and can explain how to have your education and experience recognised.',
        link: { href: 'https://isans.ca/' },
      },
      {
        id: 'library',
        title: 'Get a free library card',
        body: 'Halifax Public Libraries offer free cards, internet access, language circles and programs for children.',
        link: { href: 'https://www.halifaxpubliclibraries.ca/' },
      },
    ],
  },
  {
    id: 'later',
    num: '04',
    tab: 'Your first 3–6 months',
    title: 'Your first 3–6 months',
    subtitle: 'Build your footing and find your community.',
    eyebrow: 'Your first 3–6 months',
    items: [
      {
        id: 'taxes',
        title: 'File your first tax return',
        body: 'Filing taxes each spring can make you eligible for benefits and credits, even if you earned little or no income.',
        link: { href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-information-newcomers-canada.html' },
      },
      {
        id: 'credit',
        title: 'Start building a credit history',
        body: 'A credit card used carefully and paid in full each month helps you build a credit history for renting and borrowing later.',
      },
      {
        id: 'language',
        title: 'Take free language classes',
        body: 'Eligible newcomers can join free English or French classes. Ask a settlement agency about options near you.',
        link: { href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/new-life-canada/improve-english-french.html' },
      },
      {
        id: 'program',
        title: 'Join a NICANS program',
        body: 'Meet other families at Children Engaged, cultural events and celebrations like Iri Ji.',
        link: { href: `${NC}#events`, label: 'See programs', internal: true },
      },
      {
        id: 'volunteer',
        title: 'Volunteer in your community',
        body: 'Volunteering is a good way to make friends, practise English and gain Canadian experience.',
        link: { href: `${NC}/register?type=volunteer`, label: 'Volunteer with NICANS', internal: true },
      },
    ],
  },
]

export const DEFAULT_STAGE = 'week'
