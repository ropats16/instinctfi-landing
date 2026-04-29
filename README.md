# Instinct — Waitlist Landing

Next.js 16 landing page for the Instinct private alpha. Curated tokenised stock baskets on Solana.

## Dev

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Test

```bash
pnpm test
```

## Build

```bash
pnpm build
pnpm start
```

## Project map

- `app/page.tsx` — landing composition
- `app/layout.tsx` — fonts (Bricolage Grotesque + Inter) + metadata
- `app/globals.css` — Tailwind v4 theme tokens + dotted background
- `app/api/waitlist/route.ts` — `POST /api/waitlist`, validates email and forwards to `lib/waitlist.ts`
- `components/logo.tsx` — inline Instinct SVG (uses `currentColor`)
- `components/hero-grid.tsx` — data-driven grid with red/green bars; cell size driven by `--cell` CSS var for responsive scaling. Each cell is `<div data-col data-row>` so future per-cell animations can target by coordinate.
- `components/waitlist-form.tsx` — client component with idle/loading/success/error state
- `components/ui/{button,input}.tsx` — shadcn (base-nova style)
- `lib/grid-data.ts` — `GRID` (cols/rows) + `BARS[]` (hand-tuned positions)
- `lib/waitlist.ts` — `addToWaitlist(email)` stub. Replace body with Supabase / Resend / etc.

## Hooking up the waitlist

Right now, signups are logged to the server console. To persist them, replace the body of `addToWaitlist()` in `lib/waitlist.ts`. The signature is stable, so callers don't change.

Example with Supabase:

```ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export async function addToWaitlist(email: string): Promise<WaitlistResult> {
  const { error } = await supabase.from("waitlist").insert({ email });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
```

Example with Resend Audiences:

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function addToWaitlist(email: string): Promise<WaitlistResult> {
  const { error } = await resend.contacts.create({
    email,
    audienceId: process.env.RESEND_AUDIENCE_ID!,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
```

## Phase 2 note

The hero grid is intentionally addressable. Every cell renders as `<div data-col data-row>`. Phase 2 will animate cells (mutate their content / color over time, e.g. live tickers). Bars are also data-driven via `BARS` in `lib/grid-data.ts` — swap to live data when ready.
