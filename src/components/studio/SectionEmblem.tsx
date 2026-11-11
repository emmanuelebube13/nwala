import styled from 'styled-components'

/**
 * Section emblem (Figma 178:718): the full emblem exported from Figma as one SVG
 * (dark tilted tile, icon and frosted glass tile, including the glass fringes).
 */
const Emblem = styled.img`
  display: block;
  width: 78px;
  height: 74px;
  flex: none;
`

export default function SectionEmblem({ icon }: { icon: string }) {
  return <Emblem src={icon} alt="" aria-hidden="true" width={78} height={74} />
}
