import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

/** Figma node 178:694: studio home page. Everything sits in one centred 544px column. */

export const Column = styled.div`
  width: 100%;
  max-width: calc(544px + 2 * ${({ theme }) => theme.layout.gutter});
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.gutter};
`

/* Hero (178:697) */
export const Hero = styled.section`
  padding: 164px 0 96px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    padding: 120px 0 64px;
  }
`

export const H1 = styled.h1`
  margin: 0 0 32px;
  font-weight: 600;
  font-size: 40px;
  line-height: 1.22;
  letter-spacing: -2.4px;
  color: ${({ theme }) => theme.color.gray10};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    font-size: 32px;
    letter-spacing: -1.6px;
  }
`

export const Lead = styled.p`
  margin: 0 0 24px;
  font-size: 18px;
  line-height: 1.55;
  letter-spacing: -0.072px;
  color: ${({ theme }) => theme.color.gray8};
`

/* Light pill button (178:701 / 178:740). */
export const pill = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 7px 16px;
  border: 0;
  border-radius: 20px;
  background: radial-gradient(120% 120% at 49.2% -19.2%, ${({ theme }) => theme.color.gray3} 19%, ${({ theme }) => theme.color.gray4} 100%);
  box-shadow:
    inset 0 -1px 0 rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.49),
    0 0 0 0.5px rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.1),
    0 3px 3px -1.5px rgba(0, 0, 0, 0.1);
  font: inherit;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.gray10};
  text-decoration: none;
  cursor: pointer;
  transition: box-shadow 0.15s ease;

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    box-shadow:
      inset 0 -1px 0 rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.49),
      0 0 0 0.5px rgba(0, 0, 0, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.12),
      0 6px 8px -3px rgba(0, 0, 0, 0.12);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.gray10};
    outline-offset: 3px;
  }
`

export const PillLink = styled(Link)`
  ${pill}
`

export const PillButton = styled.button`
  ${pill}
`

export const FeaturedSection = styled.section`
  padding-bottom: 96px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    padding-bottom: 64px;
  }
`

/* Section with an emblem + heading (178:717). */
export const Section = styled.section`
  padding: 0 0 96px;
  scroll-margin-top: 80px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    padding-bottom: 64px;
  }
`

export const SectionHead = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: ${({ $gap = 32 }) => $gap}px;
`

export const H2 = styled.h2`
  margin: 0;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.22;
  letter-spacing: -1.4px;
  color: ${({ theme }) => theme.color.gray10};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    font-size: 26px;
    letter-spacing: -1px;
  }
`

/* Founder (178:710): 64px portrait, then name, role and bio. */
export const Founders = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`

export const Founder = styled.article`
  display: flex;
  gap: 32px;
  align-items: flex-start;
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: -0.064px;

  @media (max-width: 480px) {
    gap: 20px;
  }
`

export const Portrait = styled.div`
  flex: none;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 6px;
  background: ${({ theme }) => theme.color.gray5};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const FounderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  h3 {
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.color.gray10};
  }

  h3 span {
    display: block;
    font-weight: 400;
    color: ${({ theme }) => theme.color.gray8};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.color.gray8};
  }
`

/* How we work (178:744): 2 × 2 cards. */
export const Steps = styled.ol`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Step = styled.li`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.gray4};

  img {
    width: 24px;
    height: 24px;
  }

  h3 {
    margin: 0 0 8px;
    font-weight: 600;
    font-size: 20px;
    letter-spacing: -0.28px;
    color: ${({ theme }) => theme.color.gray10};
  }

  p {
    margin: 0;
    font-size: 16px;
    line-height: 1.55;
    color: ${({ theme }) => theme.color.gray8};
  }
`

/* Contact (178:738). */
export const ContactText = styled.div`
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: -0.064px;

  strong {
    display: block;
    font-weight: 600;
    color: ${({ theme }) => theme.color.gray10};
  }

  span {
    color: ${({ theme }) => theme.color.gray8};
  }
`

export const Toast = styled.div<{ $shown: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 60;
  padding: 8px 16px;
  border-radius: 20px;
  background: ${({ theme }) => theme.color.gray10};
  font-size: 13px;
  color: ${({ theme }) => theme.color.gray1};
  pointer-events: none;
  opacity: ${({ $shown }) => ($shown ? 1 : 0)};
  transform: translate(-50%, ${({ $shown }) => ($shown ? '0' : '8px')});
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
`
