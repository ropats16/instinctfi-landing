# Instinct — Waitlist Landing Page

Single-page waitlist landing for **Instinct**: curated tokenised stock baskets on Solana.

## Goals

- Pixel-faithful replica of `Landing page - waitlist.png` mockup.
- Single 100vh viewport on desktop, no scroll.
- Clean responsive behaviour at tablet (≥640px) and mobile (<640px).
- Functional waitlist email capture, with backend swappable later (Supabase / Resend).
- Center grid built so Phase 2 can animate per-cell without rewriting markup.

## Stack

- Next.js 15 (App Router) + TypeScript
- pnpm
- Tailwind CSS v4
- shadcn/ui — `Button`, `Input` only
- `next/font/google` — Bricolage Grotesque (headline), Inter (everything else)

## Layout

100vh, vertically centered. Top: logo. Center: rounded card with grid + bars. Below: headline, subtitle, email + CTA. Bottom: two-line footer.

Background: light off-white (`#F5F5F5` range), subtle dot pattern.

## Typography

- Headline (`Your cheatcode to / Internet Capital Markets.`) — Bricolage Grotesque Regular, ~48pt desktop, `letter-spacing: -0.02em`.
- Subtitle (`CURATED TOKENISED STOCK BASKETS ON SOLANA.`) — Inter Medium, uppercase, tracked, `letter-spacing: -0.02em` per spec.
- All other text — Inter (weight per visual).

## Components

```
app/
  layout.tsx              fonts, metadata
  page.tsx                landing composition
  globals.css             tailwind, dot bg, css vars
  api/waitlist/route.ts   POST → lib/waitlist
components/
  logo.tsx                Instinct SVG, currentColor
  hero-grid.tsx           data-driven grid + bars
  waitlist-form.tsx       client component, posts to /api/waitlist
lib/
  grid-data.ts            { cols, rows, bars[] }
  waitlist.ts             addToWaitlist(email) — stub now
public/Instinct-textunit.svg
```

## Hero grid (data-driven)

```ts
// lib/grid-data.ts
export const GRID = { cols: 56, rows: 14 };
export type Bar = { col: number; row: number; height: number; color: 'red' | 'green' };
export const BARS: Bar[] = [/* hand-tuned to match mockup */];
```

`hero-grid.tsx` renders:

1. A CSS grid of `cols × rows` cells. Each cell is `<div data-col data-row>` so Phase 2 animations can target by coordinate.
2. Bars overlaid using the same coordinate system (column index + height in cells).

This keeps the static visual identical to mockup while making the cells addressable.

## Waitlist API

`POST /api/waitlist` accepts `{ email: string }`, validates with a small zod schema (or hand-rolled regex if zod is overkill), calls `lib/waitlist.ts:addToWaitlist(email)`. Stub logs and returns `{ ok: true }`. Future change is one function body.

Client form: shadcn `Input` + `Button`, optimistic state (`idle` | `loading` | `success` | `error`), inline message under input.

## Responsive

- **Desktop ≥1024px** — matches mockup. Card ~640px wide.
- **Tablet 640–1024px** — card ~80vw, headline ~36pt, form unchanged.
- **Mobile <640px** — card ~92vw, headline ~28pt, form stacks vertically (input above button), grid columns reduce to ~32 to keep cells visible.

Single 100vh constraint relaxed on mobile if content would clip — page becomes naturally tall instead of cramming.

## Footer copy

```
Follow the smart money.
Built on Solana.
```

## Out of scope (Phase 2+)

- Animations on the grid (cells become alive)
- Real backend hookup (Supabase / Resend)
- Analytics, OG images, sitemap, etc.
