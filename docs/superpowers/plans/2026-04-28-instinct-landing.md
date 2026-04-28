# Instinct Waitlist Landing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-page Instinct waitlist landing matching `Landing page - waitlist.png`, with functional email capture and a data-driven grid wired for future per-cell animation.

**Architecture:** Next.js 15 App Router, TypeScript, Tailwind v4, shadcn/ui (Button + Input), `next/font/google` (Bricolage Grotesque + Inter). Hero grid renders from a config object (`cols`, `rows`, `bars[]`). Waitlist POSTs to a Next API route that delegates to a swappable `addToWaitlist()` stub.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, pnpm, zod.

**Note on testing:** Most of this plan is visual UI. Where tests make sense (data shape, API validation), TDD steps are explicit. Where they don't (typography, layout fidelity), the verification step is "run `pnpm dev`, eyeball against mockup".

---

## File Structure

```
app/
  layout.tsx                fonts + metadata
  page.tsx                  full landing
  globals.css               tailwind + dot background
  api/waitlist/route.ts     POST → lib/waitlist
components/
  logo.tsx                  inline Instinct SVG
  hero-grid.tsx             data-driven grid + bars
  waitlist-form.tsx         client form
  ui/button.tsx             shadcn
  ui/input.tsx              shadcn
lib/
  grid-data.ts              GRID + BARS config
  waitlist.ts               addToWaitlist() stub
  utils.ts                  shadcn cn()
public/
  Instinct-textunit.svg     (already present — moved here)
docs/superpowers/specs/     (existing)
docs/superpowers/plans/     (this file)
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/Instinct-textunit.svg`

- [ ] **Step 1: Run create-next-app non-interactively**

```bash
cd "/Volumes/Lucky Win/Content/Hackathons/Colosseum Frontier/Landing Page"
pnpm dlx create-next-app@latest . \
  --ts --tailwind --eslint --app --src-dir=false \
  --import-alias "@/*" --turbopack --use-pnpm --yes
```

Expected: scaffolds Next.js into the current directory (it will detect existing files and merge — if it refuses, move `Instinct-textunit.svg` and `Landing page - waitlist.png` to a tmp folder, scaffold, move them back).

- [ ] **Step 2: Move existing assets into `public/`**

```bash
mv "Instinct-textunit.svg" public/
mkdir -p design-assets
mv "Landing page - waitlist.png" design-assets/
```

- [ ] **Step 3: Verify dev server boots**

```bash
pnpm dev
```

Expected: server on `http://localhost:3000`, default Next page renders. Kill with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Scaffold: Next.js + TS + Tailwind"
```

---

## Task 2: Configure fonts and globals

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Wire fonts in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Instinct — Your cheatcode to Internet Capital Markets",
  description: "Curated tokenised stock baskets on Solana. Join the private alpha.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;
  --color-bg: #f4f4f3;
  --color-ink: #1a1a1a;
  --color-muted: #6b6b6b;
  --color-bar-red: #d8443c;
  --color-bar-green: #2ea25a;
}

html, body { height: 100%; }

body {
  background-color: var(--color-bg);
  color: var(--color-ink);
  background-image: radial-gradient(circle, #d4d4d2 1px, transparent 1px);
  background-size: 18px 18px;
  background-position: 0 0;
}
```

- [ ] **Step 3: Verify visually**

```bash
pnpm dev
```

Expected: page background is light off-white with a subtle dot grid. Inter is the default font.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: fonts + dotted background"
```

---

## Task 3: Install shadcn/ui (Button + Input)

**Files:**
- Create: `components/ui/button.tsx`, `components/ui/input.tsx`, `lib/utils.ts`, `components.json`

- [ ] **Step 1: Init shadcn**

```bash
pnpm dlx shadcn@latest init -d
```

Accept defaults (slate base, CSS variables on, RSC on).

- [ ] **Step 2: Add Button and Input**

```bash
pnpm dlx shadcn@latest add button input
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: shadcn button + input"
```

---

## Task 4: Logo component

**Files:**
- Create: `components/logo.tsx`

- [ ] **Step 1: Write `components/logo.tsx`**

The SVG ships inline so `currentColor` lets us recolor it. Replace `fill: #2b2b2b` in the SVG style with `fill: currentColor`.

```tsx
type LogoProps = { className?: string };

export function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3517.42 819.76"
      className={className}
      aria-label="Instinct"
      role="img"
    >
      <g fill="currentColor">
        <path d="M0,803.92V0h113.28v803.92H0Z" />
        <path d="M240.57,803.92V174.18h99.88l-10.98,199.76h20.71c11.37-49.52,26.59-90.14,45.68-121.8,19.07-31.67,43.24-55.22,72.48-70.65,29.23-15.42,63.33-23.14,102.31-23.14,69.83,0,122.8,24.97,158.95,74.91,36.13,49.94,54.22,124.45,54.22,223.51v347.15h-112.07v-337.4c0-71.45-11.16-124.24-33.49-158.35-22.35-34.1-55.02-51.16-98.05-51.16-38.99,0-72.08,12.18-99.27,36.55-27.23,24.36-48.55,56.44-63.95,96.23-15.43,39.8-23.95,82.82-25.59,129.11v285.03h-110.83Z" />
        <path d="M1129.01,819.76c-43.85,0-82.82-4.68-116.92-14.01-34.11-9.32-62.55-22.73-85.27-40.2-22.76-17.45-40.21-38.36-52.4-62.73-12.16-24.36-18.68-51.15-19.48-80.39l93.8-24.36c-1.64,26.8,5.06,50.15,20.09,70.04,15.02,19.91,36.55,35.14,64.56,45.67,28.02,10.57,61.92,15.84,101.72,15.84,47.91,0,85.05-8.1,111.45-24.36,26.38-16.24,39.59-38.56,39.59-67,0-22.73-7.31-40.39-21.92-52.99-14.62-12.58-34.72-22.72-60.3-30.45-25.58-7.7-55.84-14.8-90.74-21.32-29.23-6.49-58.48-13.8-87.71-21.92-29.23-8.1-55.84-18.88-79.79-32.28-23.95-13.4-43.24-31.06-57.85-52.99-14.62-21.92-21.92-49.12-21.92-81.61,0-38.15,10.16-71.04,30.46-98.66,20.29-27.59,49.12-49.12,86.48-64.56,37.34-15.42,82.01-23.14,133.98-23.14s96.24,7.91,132.78,23.75c36.54,15.84,65.34,37.97,86.48,66.39,21.1,28.43,32.9,61.72,35.33,99.88l-96.23,24.36c-.82-26.8-7.91-49.52-21.32-68.21-13.39-18.67-32.28-32.68-56.64-42.03-24.36-9.32-52.79-14-85.25-14-43.06,0-77.17,8.13-102.34,24.36-25.17,16.25-37.75,38.58-37.75,67,0,21.13,7.49,38.18,22.53,51.15,15.02,13,35.52,23.14,61.52,30.46,25.97,7.31,54.81,14.62,86.48,21.92,32.47,6.5,63.52,13.82,93.18,21.92,29.62,8.13,56.22,18.69,79.78,31.67,23.55,13,42.21,30.26,56.04,51.77,13.8,21.52,20.71,48.93,20.71,82.22,0,41.41-10.98,76.13-32.9,104.14-21.92,28.02-52.58,49.14-91.95,63.34-39.4,14.2-85.48,21.32-138.25,21.32Z" />
        <path d="M1497.39,803.92c-.05-60.09-.11-120.18-.17-180.27v-356.89h-95.01l1.21-92.57h59.7c20.29,0,35.11-3.65,44.45-10.96,9.32-7.31,14.8-19.49,16.43-36.55l12.19-95.01h68.21v142.51h181.49c-.03,22.8-.06,45.6-.09,68.39-9.41.79-23.51,2-40.63,3.61-96.23,9.03-117.51,14.51-130.04,30.65-10.47,13.49-10.9,29.34-11.04,39.97-.75,56.42-1.28,163.99.3,304.41-.04,60.9-.09,121.8-.13,182.71h-106.89Z" />
        <path d="M1786.51,133.01c-26,0-45.48-5.27-58.46-15.83-13.01-10.54-19.5-26.38-19.5-47.51s6.49-36.94,19.5-47.51c12.98-10.54,32.07-15.84,57.25-15.84s45.45,5.29,58.46,15.84c12.98,10.57,19.5,26.4,19.5,47.51s-6.52,35.93-19.5,46.89c-13.01,10.96-32.08,16.44-57.25,16.44ZM1730.48,803.54v-501.27h110.86v501.27h-110.86Z" />
        <path d="M1939.7,803.92V174.18h99.88l-10.96,199.76h20.69c11.37-49.52,26.59-90.14,45.7-121.8,19.07-31.67,43.24-55.22,72.47-70.65,29.23-15.42,63.34-23.14,102.31-23.14,69.83,0,122.82,24.97,158.96,74.91,36.13,49.94,54.2,124.45,54.2,223.51v347.15h-112.06v-337.4c0-71.45-11.17-124.24-33.49-158.35-22.35-34.1-55.03-51.16-98.06-51.16-38.98,0-72.08,12.18-99.27,36.55-27.21,24.36-48.53,56.44-63.95,96.23-15.43,39.8-23.95,82.82-25.58,129.11v285.03h-110.84Z" />
        <path d="M2862.98,819.76c-55.22,0-102.12-8.94-140.69-26.8-38.57-17.85-69.83-41.81-93.79-71.86-23.95-30.03-41.42-64.56-52.37-103.54-10.98-38.97-16.43-79.57-16.43-121.8,0-46.29,6.06-89.72,18.25-130.33,12.19-40.59,30.66-76.53,55.43-107.79,24.77-31.25,55.61-55.62,92.57-73.08,36.93-17.46,80.17-26.19,129.72-26.19s90.15,8.34,126.69,24.97c36.54,16.65,66.37,40,89.51,70.04,23.17,30.06,37.96,65.78,44.48,107.19l-105.98,29.24c-1.64-22.73-8.34-44.65-20.1-65.78-11.8-21.1-29.05-38.37-51.76-51.77-22.74-13.4-50.76-20.1-84.05-20.1s-58.67,6.09-80.99,18.27c-22.35,12.18-41.03,29.23-56.04,51.16-15.04,21.92-26.41,47.5-34.11,76.74-7.73,29.23-11.58,60.9-11.58,95.01,0,47.11,6.7,88.12,20.1,123.02,13.4,34.92,34.29,62.12,62.74,81.61,28.41,19.49,64.56,29.23,108.4,29.23,34.11,0,62.92-5.88,86.48-17.66,23.56-11.76,42.21-28.41,56.04-49.94,13.8-21.51,22.74-46.89,26.8-76.13l102.31,23.14c-5.67,34.92-16.25,65.78-31.66,92.57-15.43,26.8-34.93,48.93-58.46,66.38-23.56,17.47-50.55,30.88-81.02,40.2-30.44,9.32-63.95,14.01-100.49,14.01Z" />
        <path d="M3398.07,816.1c-58.46,0-101.91-15.84-130.35-47.51-28.41-31.67-42.63-79.97-42.63-144.95v-356.89h-95l1.21-92.57h59.7c20.29,0,35.11-3.65,44.45-10.96,9.31-7.31,14.8-19.49,16.43-36.55l12.19-95.01h68.22v142.51h181.48v93.79h-181.48v353.24c0,32.48,7.49,55.84,22.53,70.04,15.01,14.21,36.72,21.32,65.16,21.32,15.4,0,31.44-2.02,48.12-6.09,16.62-4.05,33.05-12.17,49.3-24.36v110.84c-23.56,8.94-45.27,15.02-65.16,18.27-19.89,3.24-37.96,4.87-54.19,4.87Z" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: Logo component"
```

---

## Task 5: Grid data (TDD on shape)

**Files:**
- Create: `lib/grid-data.ts`
- Create: `lib/grid-data.test.ts`

- [ ] **Step 1: Install vitest**

```bash
pnpm add -D vitest @vitest/ui
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write failing test**

```ts
// lib/grid-data.test.ts
import { describe, it, expect } from "vitest";
import { GRID, BARS } from "./grid-data";

describe("grid-data", () => {
  it("has positive grid dimensions", () => {
    expect(GRID.cols).toBeGreaterThan(0);
    expect(GRID.rows).toBeGreaterThan(0);
  });

  it("has at least one red and one green bar", () => {
    expect(BARS.some(b => b.color === "red")).toBe(true);
    expect(BARS.some(b => b.color === "green")).toBe(true);
  });

  it("places every bar inside the grid", () => {
    for (const b of BARS) {
      expect(b.col).toBeGreaterThanOrEqual(0);
      expect(b.col).toBeLessThan(GRID.cols);
      expect(b.row).toBeGreaterThanOrEqual(0);
      expect(b.row + b.height).toBeLessThanOrEqual(GRID.rows);
    }
  });
});
```

- [ ] **Step 3: Run, verify it fails**

```bash
pnpm test
```

Expected: FAIL, `grid-data` module not found.

- [ ] **Step 4: Write `lib/grid-data.ts`**

```ts
export type BarColor = "red" | "green";
export type Bar = {
  /** 0-indexed column */
  col: number;
  /** 0-indexed row of the bar's BOTTOM cell */
  row: number;
  /** number of cells tall */
  height: number;
  color: BarColor;
};

export const GRID = { cols: 56, rows: 14 } as const;

// Hand-tuned to evoke the mockup (sparse columns of red/green bars).
// Each entry is { col, row, height, color }.
// The exact arrangement is tunable — Phase 2 will replace this with live data.
export const BARS: Bar[] = [
  { col: 4,  row: 0, height: 7,  color: "red" },
  { col: 7,  row: 0, height: 4,  color: "green" },
  { col: 9,  row: 0, height: 9,  color: "red" },
  { col: 12, row: 0, height: 5,  color: "green" },
  { col: 14, row: 0, height: 11, color: "red" },
  { col: 17, row: 0, height: 6,  color: "red" },
  { col: 19, row: 0, height: 8,  color: "green" },
  { col: 22, row: 0, height: 3,  color: "red" },
  { col: 24, row: 0, height: 10, color: "green" },
  { col: 26, row: 0, height: 12, color: "green" },
  { col: 29, row: 0, height: 7,  color: "red" },
  { col: 31, row: 0, height: 9,  color: "green" },
  { col: 34, row: 0, height: 5,  color: "red" },
  { col: 37, row: 0, height: 8,  color: "green" },
  { col: 40, row: 0, height: 4,  color: "red" },
  { col: 43, row: 0, height: 11, color: "red" },
  { col: 46, row: 0, height: 6,  color: "green" },
  { col: 49, row: 0, height: 9,  color: "red" },
  { col: 52, row: 0, height: 5,  color: "green" },
];
```

- [ ] **Step 5: Run, verify pass**

```bash
pnpm test
```

Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: grid data + tests"
```

---

## Task 6: HeroGrid component

**Files:**
- Create: `components/hero-grid.tsx`

- [ ] **Step 1: Write `components/hero-grid.tsx`**

```tsx
import { GRID, BARS, type Bar } from "@/lib/grid-data";

const CELL = 11; // px

export function HeroGrid() {
  const widthPx = GRID.cols * CELL;
  const heightPx = GRID.rows * CELL;

  return (
    <div className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-black/5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>

      {/* Grid canvas */}
      <div
        className="relative mx-auto my-6"
        style={{ width: widthPx, height: heightPx }}
      >
        {/* Dotted cell grid */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${GRID.cols}, ${CELL}px)`,
            gridTemplateRows: `repeat(${GRID.rows}, ${CELL}px)`,
          }}
        >
          {Array.from({ length: GRID.cols * GRID.rows }, (_, i) => {
            const col = i % GRID.cols;
            const row = Math.floor(i / GRID.cols);
            return (
              <div
                key={i}
                data-col={col}
                data-row={row}
                className="flex items-center justify-center"
              >
                <span className="size-[2px] rounded-full bg-black/15" />
              </div>
            );
          })}
        </div>

        {/* Bars */}
        {BARS.map((bar, i) => (
          <BarShape key={i} bar={bar} />
        ))}
      </div>
    </div>
  );
}

function BarShape({ bar }: { bar: Bar }) {
  const left = bar.col * CELL;
  const bottom = bar.row * CELL;
  const width = CELL - 2;
  const height = bar.height * CELL - 2;
  const bg = bar.color === "red" ? "var(--color-bar-red)" : "var(--color-bar-green)";
  return (
    <span
      className="absolute rounded-[2px]"
      style={{ left, bottom, width, height, background: bg }}
    />
  );
}
```

- [ ] **Step 2: Drop into page temporarily to verify**

Edit `app/page.tsx`:

```tsx
import { HeroGrid } from "@/components/hero-grid";

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center p-8">
      <HeroGrid />
    </main>
  );
}
```

```bash
pnpm dev
```

Expected: rounded card with three traffic-light dots, dotted grid, scattered red/green bars rising from the bottom. Tweak `BARS` if the rhythm looks off.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: HeroGrid component"
```

---

## Task 7: Waitlist library + API route (TDD)

**Files:**
- Create: `lib/waitlist.ts`
- Create: `lib/waitlist.test.ts`
- Create: `app/api/waitlist/route.ts`

- [ ] **Step 1: Install zod**

```bash
pnpm add zod
```

- [ ] **Step 2: Write failing test for `addToWaitlist`**

```ts
// lib/waitlist.test.ts
import { describe, it, expect, vi } from "vitest";
import { addToWaitlist } from "./waitlist";

describe("addToWaitlist", () => {
  it("returns ok for a valid email", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await addToWaitlist("test@example.com");
    expect(result).toEqual({ ok: true });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
pnpm test
```

Expected: FAIL, module not found.

- [ ] **Step 4: Implement `lib/waitlist.ts`**

```ts
export type WaitlistResult = { ok: true } | { ok: false; error: string };

/**
 * Phase 1: log only. Phase 2 swap body for Supabase / Resend.
 * Keep the signature stable so callers don't change.
 */
export async function addToWaitlist(email: string): Promise<WaitlistResult> {
  console.log("[waitlist] new signup:", email);
  return { ok: true };
}
```

- [ ] **Step 5: Run, verify pass**

```bash
pnpm test
```

- [ ] **Step 6: Write API route test**

```ts
// app/api/waitlist/route.test.ts
import { describe, it, expect } from "vitest";
import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/waitlist", () => {
  it("400s on invalid email", async () => {
    const res = await POST(req({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("200s on valid email", async () => {
    const res = await POST(req({ email: "ok@example.com" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
```

- [ ] **Step 7: Run, verify fail**

```bash
pnpm test
```

Expected: FAIL, route not implemented.

- [ ] **Step 8: Implement `app/api/waitlist/route.ts`**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { addToWaitlist } from "@/lib/waitlist";

const Body = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const result = await addToWaitlist(parsed.data.email);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
```

- [ ] **Step 9: Run, verify all pass**

```bash
pnpm test
```

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: waitlist API + lib"
```

---

## Task 8: WaitlistForm component

**Files:**
- Create: `components/waitlist-form.tsx`

- [ ] **Step 1: Write `components/waitlist-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "Something went wrong");
        return;
      }
      setState("success");
      setMessage("You're on the list.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row"
    >
      <Input
        type="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 rounded-full bg-white/80 text-center sm:flex-1 sm:text-left"
      />
      <Button
        type="submit"
        disabled={state === "loading"}
        className="h-11 rounded-full bg-black px-6 text-white hover:bg-black/90"
      >
        {state === "loading" ? "Joining…" : "Join the private alpha →"}
      </Button>
      {message && (
        <p
          className={`text-xs sm:absolute sm:translate-y-12 ${
            state === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: WaitlistForm"
```

---

## Task 9: Compose the page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { Logo } from "@/components/logo";
import { HeroGrid } from "@/components/hero-grid";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Page() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-between px-6 py-8 lg:h-svh lg:py-10">
      {/* Logo */}
      <header className="flex w-full justify-center">
        <Logo className="h-6 w-auto text-black sm:h-7" />
      </header>

      {/* Hero */}
      <section className="flex w-full flex-1 flex-col items-center justify-center gap-8 py-8">
        <div className="w-full max-w-2xl">
          <HeroGrid />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <h1
            className="font-display text-3xl leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-5xl"
          >
            Your cheatcode to
            <br />
            Internet Capital Markets.
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] sm:text-xs">
            Curated tokenised stock baskets on Solana.
          </p>
        </div>

        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center text-center text-xs text-[var(--color-muted)]">
        <p>Follow the smart money.</p>
        <p>Built on Solana.</p>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Run dev, eyeball against mockup**

```bash
pnpm dev
```

Compare side-by-side with `design-assets/Landing page - waitlist.png`. Specifically check:
- Logo size and weight at top
- Card chrome (three dots) and grid density
- Headline font is Bricolage, two lines, tight kerning
- Subtitle is uppercase, tracked
- Email input + black pill button on one row at desktop
- Two-line footer at bottom
- No vertical scroll at desktop ≥1024px on a 900px tall viewport

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: assemble landing page"
```

---

## Task 10: Responsive pass

**Files:**
- Modify: `app/page.tsx` (likely), `components/hero-grid.tsx` (cell size on mobile)

- [ ] **Step 1: Wrap HeroGrid with a responsive scale**

The grid has a fixed pixel size (`56 cols × 11px = 616px`). On smaller viewports it overflows. Scale it down at the wrapper using a CSS variable that changes per breakpoint. Do NOT modify `hero-grid.tsx` — keep the component pixel-pure so Phase 2 animations can target absolute cell coordinates.

In `app/page.tsx`, replace the `<HeroGrid />` site with:

```tsx
<div className="w-full overflow-hidden [--g-scale:0.55] sm:[--g-scale:0.8] lg:[--g-scale:1]">
  <div
    className="origin-top mx-auto"
    style={{ transform: "scale(var(--g-scale))", width: "fit-content" }}
  >
    <HeroGrid />
  </div>
</div>
```

Note: scaling shrinks visual size but the scaled element still reserves its un-scaled height in layout. To collapse the empty space below, wrap in a height-constrained container:

```tsx
<div
  className="w-full overflow-hidden [--g-scale:0.55] sm:[--g-scale:0.8] lg:[--g-scale:1]"
  style={{ height: "calc(var(--g-card-h, 240px) * var(--g-scale))" }}
>
  ...
</div>
```

If that gets fiddly, simpler fallback: render a smaller grid on mobile by halving `CELL` constant in `hero-grid.tsx` via a media query — but only if the scale approach causes layout pain.

- [ ] **Step 2: Verify three breakpoints in dev tools**

```bash
pnpm dev
```

Check viewport widths: 375 (mobile), 768 (tablet), 1280 (desktop). On each:
- Card visible, no horizontal overflow
- Headline reads cleanly, no mid-word breaks
- Form: stacked on mobile, inline on tablet+
- Footer pinned to bottom

Adjust headline/subtitle font sizes, vertical gaps, and `--g-scale` values until clean.

- [ ] **Step 3: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: responsive breakpoints"
```

---

## Task 11: Final polish + README

**Files:**
- Create: `README.md` (only if missing — Next scaffold creates one; modify it instead)

- [ ] **Step 1: Replace README content**

```md
# Instinct — Waitlist Landing

Next.js 15 landing page for the Instinct private alpha.

## Dev

```bash
pnpm install
pnpm dev
```

## Test

```bash
pnpm test
```

## Hooking up the waitlist

Email submissions hit `POST /api/waitlist`, which calls `lib/waitlist.ts:addToWaitlist()`.
That function currently logs to console. Replace its body with Supabase / Resend / etc.
```

- [ ] **Step 2: Final verification**

```bash
pnpm test && pnpm build
```

Expected: tests pass, production build succeeds.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: README + final polish"
```

---

## Done criteria

- [ ] `pnpm dev` renders the page matching the mockup at desktop, tablet, mobile.
- [ ] `pnpm test` green.
- [ ] `pnpm build` succeeds.
- [ ] Submitting an email shows a success message; check terminal for the log line.
- [ ] Each cell in the hero grid is a `<div data-col data-row>` (verify in DevTools — Phase 2 will mutate these).
