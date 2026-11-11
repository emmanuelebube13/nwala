import StudioShell from '../../components/studio/StudioShell.tsx'
import { nicansScreens, screenPath, screenThumb } from '../../data/nicansScreens.ts'
import {
  Actions,
  BackLink,
  Body,
  Card,
  Cards,
  Detail,
  H2,
  Page,
  PillLink,
  Row,
  ScreensSection,
  Thumb,
  Thumbs,
  Title,
} from './NicansCase.styles.ts'

const ICONS = '/assets/studio/case'

const audiences = [
  { title: 'Newcomers', text: 'Just arrived in Nova Scotia, often on a phone, sometimes reading in a second language.' },
  { title: 'Families', text: 'Want to sign children up for cultural programs.' },
  { title: 'Volunteers & partners', text: 'Want to help, or work with the association.' },
  { title: 'NICANS volunteers', text: 'Need less admin, not more.' },
]

const principles = [
  { title: 'Task first', text: 'Answer “what can I do here?” before “who are we?”' },
  { title: 'Three clicks or fewer', text: 'To any key action.' },
  { title: 'Plain language', text: 'And real community imagery.' },
  { title: 'Accessible by default', text: 'Contrast checked, labels above fields, errors never shown by colour alone.' },
]

/** Screen thumbnails open each screen's page with its design reasoning. */

/** NICANS case-study overview (Figma node 164:256). */
export default function NicansCase() {
  return (
    <StudioShell active="work">
      <Page>
        <BackLink to="/work">
          <img src={`${ICONS}/arrow-left.svg`} alt="" aria-hidden="true" width={24} height={24} />
          All work
        </BackLink>

        <Row $first aria-labelledby="case-title">
          <div>
            <Title id="case-title">NICANS: a digital front desk</Title>
            <Actions>
              <PillLink to={screenPath(nicansScreens[0].slug)}>
                <img src={`${ICONS}/monitor.svg`} alt="" aria-hidden="true" width={18} height={18} />
                View screen by screen
              </PillLink>
            </Actions>
          </div>
          <div>
            <Body>
              A website concept for the Ndi Igbo Cultural Association of Nova Scotia, designed to help newcomers,
              families, volunteers and partners act for themselves without sending an email.
            </Body>
            <Detail>
              <dt>Scope</dt>
              <dd>UX &amp; Visual design</dd>
            </Detail>
          </div>
        </Row>

        <Row aria-labelledby="brief-title">
          <H2 id="brief-title">The Brief</H2>
          <Body>
            NICANS asked for a site that works as a “digital front desk”. Their volunteers were answering the same
            questions by email and handling registrations by hand. The goal was a site where people could find what they
            need and act on it themselves, and where volunteers could see everything in one place.
          </Body>
        </Row>

        <Row aria-labelledby="audience-title">
          <H2 id="audience-title">Who it’s for</H2>
          <Cards>
            {audiences.map((a) => (
              <Card key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </Card>
            ))}
          </Cards>
        </Row>

        <Row aria-labelledby="principles-title">
          <H2 id="principles-title">Design principles</H2>
          <Cards>
            {principles.map((p) => (
              <Card key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Card>
            ))}
          </Cards>
        </Row>

        <ScreensSection id="screens" aria-labelledby="screens-title">
          <H2 id="screens-title">All Screens</H2>
          <Thumbs>
            {nicansScreens.map((s) => (
              <li key={s.slug}>
                <Thumb to={screenPath(s.slug)} aria-label={`${s.title}: view screen and design reasoning`}>
                  <img src={screenThumb(s.slug)} alt="" width={704} height={628} loading="lazy" />
                </Thumb>
              </li>
            ))}
          </Thumbs>
        </ScreensSection>
      </Page>
    </StudioShell>
  )
}
