import { Link } from 'react-router-dom'
import styled from 'styled-components'

/** Figma node 120:2707: "Featured concept" folder (back panel, paper with screen peek, front panel). */

const ASSETS = '/assets/studio/featured'

export const Card = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
  max-width: 545px;
  /* The front panel starts 62px below the back panel's top edge. */
  padding-top: 62px;
  perspective: 1200px;
  color: ${({ theme }) => theme.color.gray10};
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.gray10};
    outline-offset: 6px;
    border-radius: 12px;
  }
`

/* Back panel with its tab (120:2708). The SVG stretches horizontally on narrow screens. */
export const Back = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 297px;
  pointer-events: none;
`

/* White paper (120:2709), 6px in from each side. The screen peeks out of it (121:2775). */
export const Paper = styled.div`
  position: absolute;
  top: 24px;
  left: 6px;
  right: 6px;
  height: 272px;
  overflow: hidden;
  background: ${({ theme }) => theme.color.gray1};
  pointer-events: none;
  transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);

  ${Card}:hover &,
  ${Card}:focus-visible & {
    transform: translateY(-34px) rotate(-1.5deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const Screen = styled.img`
  position: absolute;
  top: 8px;
  left: calc(50% - 315.22px);
  width: 631.111px;
  max-width: none;
  height: 355px;
  object-fit: cover;
`

/* Front panel (120:2710). */
export const Front = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 40px;
  border-radius: 0 0 12px 12px;
  background: ${({ theme }) => theme.color.gray5};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
  filter: drop-shadow(0 0 1px rgba(85, 85, 85, 0.5));
  transform-origin: bottom center;
  transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);

  ${Card}:hover &,
  ${Card}:focus-visible & {
    transform: rotateX(-10deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 477px;
`

export const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
`

export const Title = styled.h2`
  margin: 0;
  font-weight: 600;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -1px;
`

export const Text = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
`

/* Dark "View the concept" button (120:2715). A span: the whole card is the link. */
export const Button = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 7px 16px;
  overflow: clip;
  border-radius: 20px;
  background: radial-gradient(120% 120% at 49.2% -19.2%, ${({ theme }) => theme.color.gray9} 19%, ${({ theme }) => theme.color.gray10} 100%);
  box-shadow:
    inset 0 -1px 0 rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 0 0 0.5px rgba(0, 0, 0, 0.58),
    0 1px 2px rgba(0, 0, 0, 0.1),
    0 3px 3px -1.5px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.gray1};
  transition: filter 0.15s ease;

  ${Card}:hover & {
    filter: brightness(1.15);
  }
`

export const Lock = styled.img`
  width: 18px;
  height: 18px;
`

/* Orange "Featured concept" tab (120:2719) with its slanted end (120:2720). */
export const Tag = styled.span`
  position: absolute;
  top: -25px;
  left: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 4px 4px 8px;
  background: ${({ theme }) => theme.color.volcano5};
  font-weight: 600;
  font-size: 11px;
  line-height: 17px;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.gray10};
`

export const TagEnd = styled.img`
  position: absolute;
  top: 0;
  right: -25px;
  width: 25px;
  height: 25px;
`

export const assets = {
  back: `${ASSETS}/folder-back.svg`,
  screen: `${ASSETS}/concept-screen.webp`,
  screenFallback: `${ASSETS}/concept-screen.jpg`,
  lock: `${ASSETS}/lock.svg`,
  tagEnd: `${ASSETS}/tab-end.svg`,
}
