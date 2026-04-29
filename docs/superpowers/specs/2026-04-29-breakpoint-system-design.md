# Breakpoint system

## Why

Current responsive setup (as of `35c0f7c`) is chaotic:

- Only `lg:` / `xl:` / `2xl:` Tailwind tiers used; `md:` essentially absent.
- Mobile and tablet collapsed into the unprefixed default — no real tablet treatment.
- Three different responsive techniques layered on the same elements: Tailwind tier prefixes, `clamp()` typography, and viewport-ratio math like `min(70vw, 40vh)`. Hard to predict which wins where.
- Behavior change at `lg:` (`min-h-svh` → `h-svh`) is meaningful but never named or documented.

This spec defines a 4-tier breakpoint system aligned with common design-layout conventions, and a strict rule for which mechanism owns which property — so cleanup is a refactor against a clear standard, not vibes.

## 1. Breakpoint tokens

Override Tailwind 4's defaults in `app/globals.css` `@theme`:

```css
@theme {
  --breakpoint-sm: initial;     /* drop — not in our 4-tier system */
  --breakpoint-2xl: initial;    /* drop — not in our 4-tier system */
  --breakpoint-xl: 90rem;       /* 1440px — override default 1280 for "wide" */
  /* md = 768 (tablet) and lg = 1024 (desktop) keep Tailwind defaults */
}
```

Tier mapping (add as a comment in `globals.css` for future contributors):

```
Tiers:
  <768   mobile   (unprefixed)
  md     768+     tablet
  lg     1024+    desktop
  xl     1440+    wide
```

Why keep Tailwind's prefix names rather than custom (`tablet:` / `desktop:` / `wide:`):

- `md` (768) and `lg` (1024) already match our tablet/desktop values exactly. No rename across the codebase.
- Snippets, docs, and contributor muscle memory still work.
- Dropping `sm:` and `2xl:` makes them no-ops — any leftover use becomes a visible no-effect class in code review.

## 2. Three-bucket scaling philosophy

Hybrid approach. Every responsive property belongs to exactly one of three buckets. **One mechanism per property** — never combine `clamp()` and tier prefixes on the same property.

### Bucket 1 — Typography → fluid `clamp()`, no tier prefix

One `clamp()` per text element with min/max bounds chosen so:

- Min is readable on a 320px viewport.
- Max is sane on 4K monitors.

No `lg:text-...` overrides. If a heading needs to wrap differently on a tier, use `max-w-[Nch]` (Bucket 2) — not a font-size override.

### Bucket 2 — Spacing & sizing → tier-stepped Tailwind utilities

Padding, gaps, element heights, and max-widths step at tier boundaries. Pattern:

```
gap-4 md:gap-5 lg:gap-6 xl:gap-8
```

No `clamp()` on these. Predictable, easy to nudge per tier.

### Bucket 3 — Layout topology & viewport-bound math

Properties that use viewport-relative units (`svh`, `vw`, `vh`) directly, plus structural changes. May or may not carry a tier prefix — depends on whether the formula varies per tier.

- `<main>` height = `h-svh` is Bucket 3 with no tier prefix (same formula at every tier).
- Visualizer `max-w-[min(Xvw, Yvh)]` is Bucket 3 with tier prefixes (formula varies per tier because the surrounding layout's space budget shifts).

Bucket 3 exists because the page must fit in viewport height (single-fold). That's a real layout constraint that no amount of tier-stepped pixel values can capture cleanly.

### The rule

> A given element-property pair belongs to exactly one bucket. If you find yourself writing `text-[clamp(...)] lg:text-[clamp(...)]`, you've combined buckets 1 and 3 on the same property. Pick one.

This is what kills the current "is the clamp or the `lg:` winning here" guessing game.

## 3. Fold behavior

`<main>` is `h-svh` on every tier. No tier-prefixed override.

- `svh` (small viewport height) handles mobile browser chrome correctly — won't jump when the address bar shows/hides.
- Mobile already fits in viewport with the current visualizer + spacing values, so this is visually a no-op vs the current `min-h-svh` on mobile.
- Layout is `flex flex-col justify-between` distributing logo / hero / footer across whatever vertical space is available. Visualizer's viewport-bound math (Bucket 3) ensures it shrinks rather than pushing siblings out.

## 4. Element-by-element rules

Mobile values are taken from current code unchanged where current code is fine. Numbers below are starting points — once the refactor is applied and viewed in browser, individual values can be nudged. The *system* is what's being committed; values get tuned.

| Element | Property | Bucket | Rule |
|---|---|---|---|
| `<main>` | height | 3 | `h-svh` |
| `<main>` | padding | 2 | `px-6 py-6 md:py-8 lg:py-5 xl:py-6` |
| Logo (`<header><Logo>`) | size | 2 | `h-16 md:h-18 lg:h-20 xl:h-24` |
| `<section>` (hero) | gap | 2 | `gap-5 md:gap-6 lg:gap-5 xl:gap-7` |
| `<section>` (hero) | padding-y | 2 | `py-4 lg:py-2 xl:py-3` |
| Visualizer wrapper | max-width | 3 | `max-w-[min(70vw,40vh)] md:max-w-[min(60vw,42vh)] lg:max-w-[min(50vw,42vh)] xl:max-w-[min(42vw,44vh)]` |
| Text block (h1 + eyebrow wrapper) | gap | 2 | `gap-4 md:gap-5 lg:gap-5 xl:gap-6` |
| Headline `h1` | font-size | 1 | `text-[clamp(2rem,5vw,5rem)]` (no tier override) |
| Eyebrow `<p>` | font-size | 1 | `text-[clamp(0.7rem,1vw,1rem)]` (no tier override) |
| `<form>` (waitlist) | max-width | 2 | `max-w-[320px] md:max-w-[380px] lg:max-w-[400px] xl:max-w-[420px]` |
| `<form>` | gap | 2 | `gap-2 xl:gap-3` |
| `<Input>` | height | 2 | `h-9 md:h-10 lg:h-10 xl:h-12` |
| `<Input>` | font-size | 2 | `text-sm xl:text-base` |
| `<Button>` | height | 2 | `h-11 md:h-11 lg:h-12 xl:h-14` |
| `<Button>` | font-size | 2 | `text-sm xl:text-base` |
| `<footer>` | font-size | 1 | `text-[clamp(0.75rem,0.9vw,0.95rem)]` (no tier override) |

Notes:

- `lg:` (desktop) values are often equal or close to `md:` (tablet) values. That's intentional — tablet→desktop transition shouldn't introduce a jarring jump. Most "size up" energy lives at `xl:` (wide) where there's actual extra real estate.
- Form's previous `max-w-[clamp(260px,22vw,420px)]` violated the bucket rule (`vw`-driven clamp on a property that should be Bucket 2). Refactored to tier-stepped scale.

## 5. Scope of refactor

Files to touch:

- `app/globals.css` — add `@theme` breakpoint overrides + tier comment.
- `app/page.tsx` — apply rules from §4 for `<main>`, header, `<section>`, visualizer wrapper, text block, `h1`, eyebrow `<p>`, `<footer>`.
- `components/waitlist-form.tsx` — apply rules from §4 for `<form>`, `<Input>`, `<Button>`.
- `components/hero-grid.tsx` — drop the stray `sm:` (becomes no-op after `--breakpoint-sm: initial`) and clean Bucket 2 stepping. Note: this component is no longer rendered by `page.tsx` (replaced by video visualizer in commit `454d55a`), so cleanup here is hygienic, not user-visible.

Out of scope:

- No other components changed.
- No structural / topology changes — page stays a single centered vertical column at every tier.
- No new design tokens beyond breakpoints. Spacing and color tokens unchanged.

## 6. Verification

Visual check at four canonical widths after refactor:

- Mobile: 390px (iPhone 14)
- Tablet: 820px (iPad portrait)
- Desktop: 1280px (typical laptop)
- Wide: 1728px (16" MBP)

Plus a "short window" check at 1280×720 to confirm the single-fold visualizer math still leaves room for logo + headline + form + footer.

## Unresolved questions

- xl:max-w-[min(42vw,44vh)] on visualizer — feels right but tight at 1440×900; visual check needed.
- input/button height jumps at xl: (h-12 / h-14) — match design intent or too big?
- footer font clamp upper bound 0.95rem — too small at wide?
- hero-grid.tsx — keep around as dead code or delete in same refactor?
