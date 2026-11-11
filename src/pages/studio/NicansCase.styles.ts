import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

/** Figma node 164:256: NICANS case-study overview. */

const narrow = '900px'

export const Page = styled.div`
  width: 100%;
  max-width: calc(${({ theme }) => theme.layout.content} + 2 * ${({ theme }) => theme.layout.gutter});
  margin: 0 auto;
  padding: 153px ${({ theme }) => theme.layout.gutter} 120px;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    max-width: calc(${({ theme }) => theme.layout.content} + 2 * ${({ theme }) => theme.layout.gutterWide});
    padding-left: ${({ theme }) => theme.layout.gutterWide};
    padding-right: ${({ theme }) => theme.layout.gutterWide};
  }

  @media (max-width: ${narrow}) {
    padding-top: 112px;
    padding-bottom: 72px;
  }
`

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.color.gray10};
  text-decoration: none;

  img {
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: translateX(-3px);
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
  }
`

/* Two-column row: heading on the left, content in the 544px right column. */
export const Row = styled.section<{ $first?: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 544px;
  column-gap: 32px;
  align-items: start;
  margin-top: ${({ $first }) => ($first ? '46px' : '88px')};

  @media (max-width: ${narrow}) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 20px;
    margin-top: ${({ $first }) => ($first ? '32px' : '64px')};
  }
`

export const Title = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 40px;
  line-height: 1.22;
  letter-spacing: -2.4px;
  color: ${({ theme }) => theme.color.gray10};

  @media (max-width: ${narrow}) {
    font-size: 32px;
    letter-spacing: -1.6px;
  }
`

export const H2 = styled.h2`
  margin: 0;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.22;
  letter-spacing: -1.4px;
  color: ${({ theme }) => theme.color.gray10};

  @media (max-width: ${narrow}) {
    font-size: 26px;
    letter-spacing: -1px;
  }
`

export const Body = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: -0.064px;
  color: ${({ theme }) => theme.color.gray8};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 40px;

  @media (max-width: ${narrow}) {
    gap: 12px;
    margin-top: 24px;
  }
`

/* Light pill button (174:547 / 174:552). */
const pill = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 7px 16px;
  border-radius: 20px;
  background: radial-gradient(120% 120% at 49.2% -19.2%, ${({ theme }) => theme.color.gray2} 19%, ${({ theme }) => theme.color.gray4} 100%);
  box-shadow:
    inset 0 -1px 0 rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.49),
    0 0 0 0.5px rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.1),
    0 3px 3px -1.5px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.gray10};
  text-decoration: none;
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


export const Detail = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0 0;

  dt {
    font-size: 13px;
    color: ${({ theme }) => theme.color.gray8};
  }

  dd {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
    letter-spacing: -0.064px;
    color: ${({ theme }) => theme.color.gray10};
  }
`

/* 2 × 2 card grid (164:387 / 164:499). */
export const Cards = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 520px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.gray4};

  h3 {
    margin: 0;
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

export const ScreensSection = styled.section`
  margin-top: 88px;
  scroll-margin-top: 96px;

  @media (max-width: ${narrow}) {
    margin-top: 64px;
  }
`

/* Screen thumbnails (164:512 …): 352 × 314, 12px radius, 3 columns. */
export const Thumbs = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px 32px;
  margin: 36px 0 0;
  padding: 0;
  list-style: none;

  @media (max-width: ${narrow}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  @media (max-width: 520px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Thumb = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 352 / 314;
  overflow: hidden;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.gray4};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.03);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.gray10};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
  }
`
