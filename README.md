# Nwaala

Portfolio site for Nwaala, a two-person design and data studio in Halifax, Nova Scotia. It includes a working
concept of a "digital front desk" website for the Ndi Igbo Cultural Association of Nova Scotia (NICANS).

Built with Vite, React 19 and TypeScript. Plain CSS with design tokens taken from the Figma file. Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and production build into dist/
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Studio home: intro, featured concept, founders, how we work, contact |
| `/work` | Project list with working filters |
| `/work/nicans` | NICANS case study (password protected) |
| `/concept/nicans` | NICANS concept: home page |
| `/concept/nicans/newcomers` | Newcomer guide with checklists saved on the device |
| `/concept/nicans/register` | Multi-step registration (`?program=children-engaged`, `iri-ji`, `afamefuna-2`, `amara`, or `?type=volunteer`, `member`, `partner`, `newcomer`) |
| `/concept/nicans/dashboard` | Volunteer management hub: search, filters, status changes, CSV export |

Registrations submitted in the demo are stored in the browser and appear in the dashboard.

## Password gate

The NICANS case study, screen pages and concept are protected on the server. No database is needed.

- `POST /api/unlock` checks the password against `NICANS_PASSWORD` and sets a signed (HMAC-SHA256), httpOnly
  `nicans_session` cookie valid for 30 days. `POST /api/lock` clears it; `GET /api/session` reports the state.
- Routing Middleware (`proxy.ts`, configured in `vercel.json`) blocks `/private/*` (NICANS images) and
  `/assets/private/*` (NICANS code chunks, see `vite.config.ts`) without a valid cookie.
- Shared logic lives in `server/gate.ts`. `npm run dev` and `npm run preview` emulate the gate locally.

Set these environment variables (Vercel → Project → Settings → Environment Variables, and in `.env.local` locally):

| Variable | Value |
| --- | --- |
| `NICANS_PASSWORD` | The password. Separate alternatives with commas; matching ignores case and extra spaces. |
| `NICANS_COOKIE_SECRET` | At least 32 random characters, e.g. `python3 -c "import secrets; print(secrets.token_hex(32))"` |

Changing `NICANS_COOKIE_SECRET` signs everyone out. Without both variables the gate stays locked.

## Editing content

- Studio name, email, founders' bios and the project list: `src/data/studio.ts`
- NICANS programs, events and sample registrations: `src/data/nicans.ts`
- Colours, fonts and spacing: `src/styles/tokens.css`
- Images: `public/assets/` (public) and `public/private/nicans/` (served only behind the password)

## Project structure

```text
src/
├── app/App.tsx              # routes
├── components/
│   ├── ConceptGate.tsx      # password page
│   ├── studio/              # studio shell, nav, footer, emblem, styles
│   └── nicans/              # NICANS layout (demo bar, header, footer) and shared styles
├── pages/
│   ├── studio/              # Home, Work, CaseStudy, NotFound
│   └── nicans/              # Landing, NewcomerGuide, Register, Dashboard (+ their CSS)
├── data/                    # content
├── lib/                     # unlock + scroll-reveal helpers
└── styles/tokens.css        # design tokens
```

`vercel.json` rewrites every path to `index.html` so deep links work on Vercel.
