import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowSquareOut, Play } from '@phosphor-icons/react'
import StudioShell from '../../components/studio/StudioShell.tsx'
import { founders, STUDIO_EMAIL, STUDIO_LOCATION } from '../../data/studio.ts'

/** A screenshot of a concept screen in a browser (or phone) frame, linking to the live screen. */
function LiveFrame({
  src,
  img,
  label,
  caption,
  device = 'desktop',
}: {
  src: string
  img: string
  label: string
  caption: string
  device?: 'desktop' | 'phone'
}) {
  return (
    <figure className={`frame${device === 'phone' ? ' frame--phone' : ''}`}>
      <div className="frame__window">
        {device === 'desktop' && (
          <div className="frame__bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>ndigbons.ca{src.replace('/concept/nicans', '').split('?')[0] || '/'}</span>
          </div>
        )}
        <div className="frame__viewport">
          <img
            src={img}
            alt={`${label}, screenshot of the working concept`}
            loading="lazy"
            width={device === 'phone' ? 390 : 1440}
            height={device === 'phone' ? 800 : 900}
          />
          <Link to={src} className="frame__open" aria-label={`Open ${label} live`}>
            <span>
              Open live screen <ArrowSquareOut size={14} style={{ display: 'inline', verticalAlign: '-2px' }} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function Reason({ problem, approach, rationale }: { problem: string; approach: string; rationale: string }) {
  return (
    <div className="cs-reason">
      <div>
        <h4>Problem</h4>
        <p>{problem}</p>
      </div>
      <div>
        <h4>Approach</h4>
        <p>{approach}</p>
      </div>
      <div>
        <h4>Rationale</h4>
        <p>{rationale}</p>
      </div>
    </div>
  )
}

const registrationSteps = [
  {
    tab: 'First child',
    problem: 'Paper and email registration can leave details missing and create back-and-forth.',
    approach:
      'A three-step flow covers parent details, child details, then review & consent. Labels sit above fields, hints explain what is needed, and errors pair an icon with plain text.',
    rationale:
      'Short steps are intended to make the form manageable. Labels remain visible while typing. Errors that do not rely on colour are designed to support colour-blind users and screen-reader users.',
  },
  {
    tab: 'Child added',
    problem: 'Families with more than one child should not have to repeat the entire registration form.',
    approach:
      'After saving, each child appears as a summary card with Edit and Remove actions. A clear “Add another child” area sits below.',
    rationale:
      'The summary makes saved details visible and gives parents a way to correct mistakes without starting over.',
  },
  {
    tab: 'Another child',
    problem: 'Adding another child needs to preserve the details already entered, without introducing a new process.',
    approach: 'The same short form opens below the saved child, keeping the first child’s details visible and safe.',
    rationale:
      'Repeating the same form keeps the interaction consistent, so there is nothing new to learn the second time.',
  },
  {
    tab: 'Confirmation',
    problem:
      'Without a clear confirmation, people may email to ask whether their registration went through, adding work for volunteers.',
    approach:
      'The concept provides instant on-screen confirmation, an automatic email, a reminder before each session and an “Add to calendar” action.',
    rationale:
      'Clear confirmation and reminders are intended to answer the follow-up questions that volunteers would otherwise handle by email.',
  },
]

function RegistrationDiscussion() {
  const [i, setI] = useState(0)
  const s = registrationSteps[i]
  return (
    <div className="cs-screen reveal">
      <div className="cs-screen__title">
        <h3>Registration: Children Engaged</h3>
        <div className="st-filters" style={{ marginTop: 0, justifyContent: 'flex-start' }} role="tablist" aria-label="Registration screens">
          {registrationSteps.map((r, n) => (
            <button
              key={r.tab}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-pressed={n === i}
              className="pill"
              onClick={() => setI(n)}
            >
              {n + 1}. {r.tab}
            </button>
          ))}
        </div>
      </div>
      <div className="cs-screen__row">
        <div className="cs-shots">
          <LiveFrame
            src="/concept/nicans/register?program=children-engaged"
            img={`/assets/screens/register-${i + 1}.jpg`}
            label={`Registration, ${s.tab.toLowerCase()}`}
            caption="Desktop. Open it live to add two children and submit."
          />
        </div>
        <div role="tabpanel" aria-label={s.tab} key={s.tab} style={{ animation: 'st-in 0.35s ease both' }}>
          <Reason problem={s.problem} approach={s.approach} rationale={s.rationale} />
        </div>
      </div>
    </div>
  )
}

export default function CaseStudy() {
  const [designer, analyst] = founders
  return (
    <StudioShell active="work">
      <div className="cs">
        <div className="cs-wide">
          <section className="cs-intro">
            <Link to="/work" className="cs-back">
              ← All work
            </Link>
            <div className="cs-intro__text">
              <p className="cs-kicker">Concept · 2026</p>
              <h1 className="reveal">NICANS: a digital front desk</h1>
              <p className="cs-intro__lead reveal">
                A website concept for the Ndi Igbo Cultural Association of Nova Scotia, designed to help newcomers,
                families, volunteers and partners act for themselves without sending an email.
              </p>
              <div className="cs-intro__actions reveal">
                <Link to="/concept/nicans" className="pill pill--dark">
                  <Play size={14} weight="fill" aria-hidden="true" /> Try the live concept
                </Link>
                <a href="#screens" className="pill">
                  Screen by screen
                </a>
              </div>
            </div>
            <dl className="cs-metadata">
              <div>
                <dt>Role</dt>
                <dd>Ifechukwu (UX &amp; visual design) · Emmanuel (data, reporting &amp; build)</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>Information architecture, 8 high-fidelity screens, desktop + mobile, working prototype</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>Figma, React</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>1 week</dd>
              </div>
            </dl>
          </section>

          <section className="cs-block reveal" aria-labelledby="brief">
            <h2 id="brief" className="cs-h2">
              The brief
            </h2>
            <p className="cs-block__body">
              NICANS asked for a site that works as a “digital front desk”. Their volunteers were answering the same
              questions by email and handling registrations by hand. The goal was a site where people could find what
              they need and act on it themselves, and where volunteers could see everything in one place.
            </p>
          </section>

          <section className="cs-grid4 reveal" aria-labelledby="audiences">
            <h2 id="audiences" className="cs-h2">
              Who it’s for
            </h2>
            <div className="cs-grid4__items">
              <div>
                <h3>Newcomers</h3>
                <p>Just arrived in Nova Scotia, often on a phone, sometimes reading in a second language.</p>
              </div>
              <div>
                <h3>Families</h3>
                <p>Want to sign children up for cultural programs.</p>
              </div>
              <div>
                <h3>Volunteers &amp; partners</h3>
                <p>Want to help, or work with the association.</p>
              </div>
              <div>
                <h3>NICANS volunteers</h3>
                <p>Need less admin, not more.</p>
              </div>
            </div>
          </section>

          <section className="cs-grid4 reveal" aria-labelledby="principles">
            <h2 id="principles" className="cs-h2">
              Design principles
            </h2>
            <div className="cs-grid4__items">
              <div>
                <h3>Task first</h3>
                <p>Answer “what can I do here?” before “who are we?”</p>
              </div>
              <div>
                <h3>Three clicks or fewer</h3>
                <p>To any key action.</p>
              </div>
              <div>
                <h3>Plain language</h3>
                <p>And real community imagery.</p>
              </div>
              <div>
                <h3>Accessible by default</h3>
                <p>Contrast checked, labels above fields, errors never shown by colour alone.</p>
              </div>
            </div>
          </section>

          <section id="screens" aria-labelledby="screens-title">
            <div className="cs-screens-head">
              <h2 id="screens-title" className="cs-h2">
                Screen by screen
              </h2>
              <p>4 discussions · 8 screens · Every screen opens live</p>
            </div>

            <div className="cs-screen reveal">
              <div className="cs-screen__title">
                <h3>Home: desktop &amp; mobile</h3>
              </div>
              <div className="cs-screen__row">
                <div className="cs-shots">
                  <LiveFrame src="/concept/nicans" img="/assets/screens/home-desktop.jpg" label="Home, desktop" caption="Desktop" />
                  <LiveFrame src="/concept/nicans" img="/assets/screens/home-mobile.jpg" label="Home, mobile" caption="Mobile" device="phone" />
                </div>
                <Reason
                  problem="The current site introduces the association before offering help. Newcomers have to dig to find a useful next step."
                  approach="The concept opens with a photo from a community celebration and two direct actions. “How can we help you today?” leads to one pathway per audience, followed by upcoming events and quick answers."
                  rationale="People arrive with a task. Real community photography is intended to build trust rather than rely on stock imagery. Events and quick answers address common questions before someone needs to email."
                />
              </div>
            </div>

            <div className="cs-screen reveal">
              <div className="cs-screen__title">
                <h3>Newcomer guide: first week</h3>
              </div>
              <div className="cs-screen__row">
                <div className="cs-shots">
                  <LiveFrame
                    src="/concept/nicans/newcomers"
                    img="/assets/screens/newcomers.jpg"
                    label="Newcomer guide"
                    caption="Desktop. Open it live to tick items; progress is saved on the device."
                  />
                </div>
                <Reason
                  problem="Settling in involves dozens of steps, and newcomers may not know which to take first."
                  approach="Four stages run from before arrival to the first 3–6 months, each with a short checklist. The concept saves progress on the device without an account and offers printing. “Talk to a volunteer” and “Call 211” stay visible."
                  rationale="Device-based progress avoids an account barrier on arrival. A printed list supports limited data or a preference for paper. Visible routes to human help keep the checklist from becoming a dead end."
                />
              </div>
            </div>

            <RegistrationDiscussion />

            <div className="cs-screen reveal">
              <div className="cs-screen__title">
                <h3>Management hub (dashboard)</h3>
              </div>
              <div className="cs-screen__row">
                <div className="cs-shots">
                  <LiveFrame
                    src="/concept/nicans/dashboard"
                    img="/assets/screens/dashboard.jpg"
                    label="Volunteer management hub"
                    caption="Desktop. Registrations you submit in the live demo appear here."
                  />
                </div>
                <Reason
                  problem="Registrations, volunteer applications and enquiries were spread across inboxes and spreadsheets."
                  approach="One hub brings weekly numbers above a searchable table, with program and status filters and one-click CSV export."
                  rationale="The aim is one screen for volunteers to review everything, with exports for board and funder reports. Emmanuel’s data & reporting approach connects this same data to simple impact reports."
                />
              </div>
            </div>
          </section>

          <section className="cs-block reveal" aria-labelledby="next">
            <h2 id="next" className="cs-h2">
              What we’d do next
            </h2>
            <ul className="cs-next">
              <li>
                <span aria-hidden="true">—</span> Test the pathways and checklist with 3–5 real newcomers
              </li>
              <li>
                <span aria-hidden="true">—</span> Refine the pathway cards: shorter, with an icon per audience
              </li>
              <li>
                <span aria-hidden="true">—</span> Add French and Igbo versions
              </li>
              <li>
                <span aria-hidden="true">—</span> Build the Find a Service directory with an interactive map (Emmanuel)
              </li>
            </ul>
          </section>

          <section className="cs-block reveal" aria-labelledby="credits">
            <h2 id="credits" className="cs-h2">
              Credits
            </h2>
            <dl className="cs-credits">
              <div>
                <dt>UX &amp; visual design</dt>
                <dd>{designer.name}</dd>
              </div>
              <div>
                <dt>Data, reporting &amp; build</dt>
                <dd>{analyst.name}</dd>
              </div>
              <div>
                <dt>Photography</dt>
                <dd>NICANS community events, used with permission</dd>
              </div>
            </dl>
          </section>

          <section className="cs-contact" aria-labelledby="cs-contact">
            <div>
              <h2 id="cs-contact">Have a project like this?</h2>
              <p style={{ fontSize: 19, marginBottom: 8 }}>Tell us about your project. We reply within 2 working days.</p>
              <p>Based in {STUDIO_LOCATION}. Happy to meet in person.</p>
            </div>
            <div className="cs-contact__action">
              <a href={`mailto:${STUDIO_EMAIL}`}>Let’s talk →</a>
              <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
            </div>
          </section>
        </div>
      </div>
    </StudioShell>
  )
}
