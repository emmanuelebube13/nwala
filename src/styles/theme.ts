/**
 * Design tokens from the Figma file, for styled-components.
 * Mirrors src/styles/tokens.css while the remaining CSS is migrated; keep the two in sync.
 */
export const theme = {
  color: {
    gray1: '#ffffff',
    gray2: '#fafafa',
    gray3: '#f5f5f5',
    gray4: '#f0f0f0',
    gray5: '#d9d9d9',
    gray6: '#bfbfbf',
    gray7: '#8c8c8c',
    gray8: '#595959',
    gray9: '#434343',
    gray10: '#262626',
    volcano5: '#ff7a45',
    studioAccent: 'rgba(129, 11, 176, 0.75)',
    studioGlass: 'rgba(11, 137, 166, 0.2)',
  },
  font: {
    studio: "'Inter Variable', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    nicans: "'DM Sans Variable', 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  shadow: {
    float:
      '0 0 0 0.5px rgba(0, 0, 0, 0.12), 0 0 4px rgba(0, 0, 0, 0.05), 0 6px 6px -3px rgba(0, 0, 0, 0.13), 0 12px 12px -6px rgba(0, 0, 0, 0.13)',
  },
  radius: {
    pill: '50px',
  },
  layout: {
    content: '1120px',
    gutter: '16px',
    gutterWide: '32px',
  },
  breakpoint: {
    tablet: '768px',
    mobileMax: '760px',
  },
} as const

export type AppTheme = typeof theme
