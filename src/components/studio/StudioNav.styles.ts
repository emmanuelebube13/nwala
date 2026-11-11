import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

/** Figma node 120:2641: floating Studio / Work pill. */

export const Header = styled.header`
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.layout.gutter};
  pointer-events: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0 ${({ theme }) => theme.layout.gutterWide};
  }
`

/* Outer pill: 2px frame around the inner pill. */
export const Pill = styled.nav<{ $scrolled: boolean }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  padding: 2px;
  /* Aligns the pill's left edge with the page's content column. */
  margin-right: min(384px, calc(100% - 164px));
  overflow: clip;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: url('/assets/studio/nav-pill-outer.png') center / cover no-repeat;
  box-shadow: ${({ theme }) => theme.shadow.float};
  transition: box-shadow 0.25s ease;

  ${({ $scrolled }) =>
    $scrolled &&
    css`
      box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.14), 0 10px 30px -8px rgba(0, 0, 0, 0.25);
    `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    margin-right: 0;
  }
`

/* Inner pill (120:2642): 1px inside stroke filled with Figma's radial gradient.
   Drawn as a real border: the image paints the padding box, the gradient paints the border box. */
export const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.pill};
  background:
    url('/assets/studio/nav-pill-inner.png') center / cover no-repeat padding-box,
    radial-gradient(
        ellipse 69.3% 620% at 30.7% 50%,
        rgba(217, 217, 217, 0.95) 2.4%,
        #ffffff 67.8%,
        ${({ theme }) => theme.color.gray4} 100%
      )
      border-box;
`

export const NavLink = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 11px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.font.studio};
  font-weight: 500;
  font-size: 13px;
  line-height: 1.4;
  letter-spacing: -0.4px;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.gray7};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.color.gray10};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.gray10};
    outline-offset: 3px;
  }

  /* Active page (120:2644). The state is carried by the 1px stroke: a multi-stop
     radial gradient centred left of the pill, so the border reads purple → orange
     on the left, near-clear across the top and bottom, light blue → blue on the right.
     The padding box repeats the inner pill's tone so only the border shows colour. */
  &[aria-current='page'] {
    color: ${({ theme }) => theme.color.gray10};
    background:
      linear-gradient(180deg, #f8f8f8, #f2f2f2) padding-box,
      radial-gradient(
          ellipse 251% 1350% at -75.4% 50%,
          rgba(129, 11, 176, 0.75) 29.1%,
          rgba(250, 140, 22, 0.26) 34.4%,
          rgba(110, 110, 110, 0.07) 41.7%,
          rgba(241, 241, 241, 0.007) 46.4%,
          rgba(238, 238, 238, 0.008) 57.1%,
          rgba(110, 110, 110, 0.07) 62.7%,
          rgba(132, 205, 251, 0.54) 68%,
          rgba(15, 64, 225, 0.71) 71.1%
        )
        border-box;
    box-shadow:
      inset 2px 0 2px rgba(69, 69, 71, 0.08),
      inset -2px 0 2px rgba(69, 69, 71, 0.08);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
