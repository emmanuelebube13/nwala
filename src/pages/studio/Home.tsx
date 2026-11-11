import { useState } from 'react'
import FeaturedConcept from '../../components/studio/FeaturedConcept.tsx'
import SectionEmblem from '../../components/studio/SectionEmblem.tsx'
import StudioShell from '../../components/studio/StudioShell.tsx'
import { useConceptDialog } from '../../components/studio/useConceptDialog.tsx'
import { founders, STUDIO_EMAIL, STUDIO_LOCATION, STUDIO_NAME } from '../../data/studio.ts'
import {
  Column,
  ContactText,
  FeaturedSection,
  Founder,
  Founders,
  FounderText,
  H1,
  H2,
  Hero,
  Lead,
  PillButton,
  PillLink,
  Portrait,
  Section,
  SectionHead,
  Step,
  Steps,
  Toast,
} from './Home.styles.ts'

const ICONS = '/assets/studio/home'

const steps = [
  { icon: 'step-listen', title: 'We Listen', text: 'We meet the people who’ll use it, in person when we can, before we design anything.' },
  { icon: 'step-design', title: 'We Design', text: 'Sketches, then real screens. You see progress every week and shape it as we go.' },
  { icon: 'step-build', title: 'We Build', text: 'Fast, accessible sites your team can update without calling us.' },
  { icon: 'step-measure', title: 'Then Measure', text: 'We track what’s working and turn it into reports your board can use.' },
]

/** Studio home page (Figma node 178:694). */
export default function Home() {
  const [copied, setCopied] = useState(false)
  const { onOpen, dialog } = useConceptDialog()

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(STUDIO_EMAIL)
    } catch {
      /* clipboard blocked: the toast still confirms the address */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <StudioShell active="studio">
      <Hero>
        <Column>
          <H1 className="reveal">
            We craft websites with a story,
            <br /> built to be used and
            <br /> measured to succeed.
          </H1>
          <Lead className="reveal">
            {STUDIO_NAME} is a two-person studio in Halifax, Nova Scotia. Our websites and apps tell your story, feel
            delightful and are easy to use, built for your customers and your business. Then we track what works, so your
            business keeps growing.
          </Lead>
          <div className="reveal">
            <PillLink to="#contact">Contact us</PillLink>
          </div>
        </Column>
      </Hero>

      <FeaturedSection aria-labelledby="featured-title">
        <Column>
          <FeaturedConcept onOpen={onOpen} />
        </Column>
      </FeaturedSection>

      <Section id="about" aria-labelledby="founders-title">
        <Column>
          <SectionHead className="reveal" $gap={56}>
            <SectionEmblem icon={`${ICONS}/emblem-founders.png`} />
            <H2 id="founders-title">Meet the founders</H2>
          </SectionHead>
          <Founders>
            {founders.map((f) => (
              <Founder key={f.name} className="reveal">
                <Portrait>
                  {/* Add a headshot by setting `photo` for this founder in src/data/studio.ts */}
                  {f.photo && <img src={f.photo} alt={`Portrait of ${f.name}`} loading="lazy" />}
                </Portrait>
                <FounderText>
                  <h3>
                    {f.name}
                    <span>{f.role}</span>
                  </h3>
                  <p>{f.bio.join(' ')}</p>
                </FounderText>
              </Founder>
            ))}
          </Founders>
        </Column>
      </Section>

      <Section aria-labelledby="how-title">
        <Column>
          <SectionHead className="reveal">
            <SectionEmblem icon={`${ICONS}/emblem-process.png`} />
            <H2 id="how-title">How we work</H2>
          </SectionHead>
          <Steps>
            {steps.map((s, i) => (
              <Step key={s.title} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <img src={`${ICONS}/${s.icon}.svg`} alt="" aria-hidden="true" width={24} height={24} />
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Step>
            ))}
          </Steps>
        </Column>
      </Section>

      <Section id="contact" aria-labelledby="contact-title">
        <Column>
          <SectionHead className="reveal">
            <SectionEmblem icon={`${ICONS}/emblem-contact.png`} />
            <H2 id="contact-title">Let’s build your ideas together.</H2>
          </SectionHead>
          <ContactText className="reveal">
            <strong>Tell us about your project. We reply within 2 working days.</strong>
            <span>We are based in {STUDIO_LOCATION} and happy to meet in person.</span>
          </ContactText>
          <div className="reveal">
            <PillButton type="button" onClick={copyEmail} aria-label={`Copy email address ${STUDIO_EMAIL}`}>
              <img src={`${ICONS}/copy.svg`} alt="" aria-hidden="true" width={18} height={18} />
              {STUDIO_EMAIL}
            </PillButton>
          </div>
        </Column>
      </Section>

      <Toast $shown={copied} role="status" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </Toast>
      {dialog}
    </StudioShell>
  )
}
