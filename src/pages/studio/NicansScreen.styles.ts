import { Link } from 'react-router-dom'
import styled from 'styled-components'

/** Figma node 177:583: screen-by-screen viewer. */

const narrow = '900px'

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'aside pager'
    'aside frame';
  column-gap: 32px;
  align-items: start;
  min-height: 100vh;
  /* Room for the fixed close button; the screen fills and centres in the remaining width. */
  padding-right: 56px;

  /* Mobile: arrows first (sticky over everything below), then the reasoning, then the screen. */
  @media (max-width: ${narrow}) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto;
    grid-template-areas:
      'pager'
      'aside'
      'frame';
    padding: 0;
  }
`

/* Left column (177:654): stays in view while the screen scrolls. */
export const Aside = styled.aside`
  grid-area: aside;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  font-size: 16px;

  /* Mobile: below the sticky arrows and above the screen. */
  @media (max-width: ${narrow}) {
    position: static;
  }
`

export const Title = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.22;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.color.gray10};
`

export const Reasons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

/* Design reasoning card (177:656). */
export const Reason = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.gray4};

  h2 {
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    color: ${({ theme }) => theme.color.gray10};
  }

  p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
    color: ${({ theme }) => theme.color.gray8};
  }
`

/* Prev / next row (178:674). */
export const Pager = styled.nav`
  grid-area: pager;
  justify-self: center;
  width: 100%;
  max-width: 1600px;
  /* Stays in view while the (often long) screen scrolls. */
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: ${({ theme }) => theme.color.gray2};

  /* Mobile: pinned to the top, sharing the row with the fixed close button (right arrow sits left of it). */
  @media (max-width: ${narrow}) {
    max-width: none;
    padding: 12px 52px 12px 16px;
  }
`

export const PagerLink = styled(Link)`
  display: inline-flex;
  padding: 2px;
  border-radius: 50%;
  transition: transform 0.2s ease;

  img {
    width: 24px;
    height: 24px;
  }

  &[data-dir='prev']:hover {
    transform: translateX(-3px);
  }

  &[data-dir='next']:hover {
    transform: translateX(3px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.gray10};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/* Screen panel (177:639): 736px wide, 12px radius; the full-length screen scrolls with the page. */
export const Frame = styled.figure`
  grid-area: frame;
  justify-self: center;
  width: 100%;
  max-width: 1600px;
  margin: 0;
  overflow: hidden;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.gray4};

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (max-width: ${narrow}) {
    width: calc(100% - 32px);
  }
`

export const Mobile = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px 0;

  img {
    width: min(390px, 100%);
  }
`

/* Close button (178:693): dark 32px circle, fixed top-right. */
export const Close = styled(Link)`
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 20;
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: 20px;
  background: ${({ theme }) => theme.color.gray10};
  transition: background 0.15s ease;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: #000;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.gray10};
    outline-offset: 2px;
  }
`

export const Footer = styled.footer`
  display: flex;
  justify-content: center;
  padding: 32px 96px;

  div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1120px;
    font-size: 14px;
    color: ${({ theme }) => theme.color.gray8};
  }

  @media (max-width: ${narrow}) {
    padding: 32px 16px;
  }
`
