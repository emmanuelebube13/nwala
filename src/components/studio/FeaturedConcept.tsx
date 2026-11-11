import type { MouseEvent } from 'react'
import {
  Back,
  Body,
  Button,
  Card,
  Copy,
  Front,
  Lock,
  Paper,
  Screen,
  Tag,
  TagEnd,
  Text,
  Title,
  assets,
} from './FeaturedConcept.styles.ts'

/** "Featured concept" folder card (Figma node 120:2707). Opens the password pop-up via onOpen. */
export default function FeaturedConcept({ onOpen }: { onOpen: (e: MouseEvent) => void }) {
  return (
    <Card to="/work/nicans" onClick={onOpen} className="reveal">
      <Back src={assets.back} alt="" aria-hidden="true" width={545} height={297} />
      <Paper aria-hidden="true">
        <picture>
          <source srcSet={assets.screen} type="image/webp" />
          <Screen src={assets.screenFallback} alt="" width={631} height={355}/>
        </picture>
      </Paper>
      <Front>
        <Tag>
          Featured concept
          <TagEnd src={assets.tagEnd} alt="" aria-hidden="true" width={25} height={25} />
        </Tag>
        <Body>
          <Copy>
            <Title id="featured-title">NICANS: A digital front desk</Title>
            <Text>
              A website concept for a Nova Scotia community association, with a newcomer guide, program registration and
              a volunteer dashboard. Shared privately with permission.
            </Text>
          </Copy>
          <Button>
            <Lock src={assets.lock} alt="" aria-hidden="true" width={18} height={18} />
            View the concept
          </Button>
        </Body>
      </Front>
    </Card>
  )
}
